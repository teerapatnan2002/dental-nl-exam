import json
import re
import time
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field
from sqlalchemy import func
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from sqlalchemy.orm import Session

import models
from auth import _decode_token
from database import get_db

router = APIRouter(prefix="/api/presence", tags=["presence"])

ONLINE_WINDOW_SECONDS = 90
PRUNE_TTL_SECONDS = 3600
_KEY_PATTERN = re.compile(r"^[A-Za-z0-9_-]{6,64}$")


class PresencePingRequest(BaseModel):
    session_key: str = Field(..., min_length=6, max_length=64)
    visitor_key: Optional[str] = Field(None, min_length=6, max_length=64)


def _sanitize_key(raw: Optional[str], field_name: str) -> Optional[str]:
    if raw is None:
        return None
    cleaned = raw.strip()
    if not _KEY_PATTERN.match(cleaned):
        raise HTTPException(status_code=400, detail=f"Invalid {field_name}")
    return cleaned


def _resolve_optional_user_id(request: Request, db: Session) -> Optional[int]:
    """Resolve authenticated user_id if a valid Bearer access token is present."""
    auth_header = request.headers.get("Authorization") or ""
    if not auth_header.lower().startswith("bearer "):
        return None
    token = auth_header[7:].strip()
    if not token:
        return None
    try:
        payload = _decode_token(token, expected_type="access")
        username = payload.get("sub")
        if not username:
            return None
        row = db.query(models.User.id).filter(models.User.username == username).first()
        return int(row[0]) if row else None
    except HTTPException:
        return None


def _read_presence_snapshot(db: Session, now_ts: int) -> dict:
    """Return distinct active online visitors and total registered members."""
    cutoff = now_ts - ONLINE_WINDOW_SECONDS
    online_count = (
        db.query(func.count(func.distinct(models.ActivePresence.identity_key)))
        .filter(models.ActivePresence.last_seen_at >= cutoff)
        .scalar()
        or 0
    )
    registered_members = db.query(func.count(models.User.id)).scalar() or 0
    return {
        "online_count": int(online_count),
        "registered_members": int(registered_members),
        "window_seconds": ONLINE_WINDOW_SECONDS,
        "updated_at": now_ts,
    }


def _upsert_presence(db: Session, session_key: str, identity_key: str, now_ts: int) -> None:
    """Atomically insert or update presence timestamp without race conditions."""
    dialect_name = db.bind.dialect.name if db.bind is not None else ""
    values = {
        "session_key": session_key,
        "identity_key": identity_key,
        "last_seen_at": now_ts,
    }
    update_set = {
        "identity_key": identity_key,
        "last_seen_at": now_ts,
    }

    if dialect_name == "postgresql":
        stmt = pg_insert(models.ActivePresence).values(**values).on_conflict_do_update(
            index_elements=["session_key"],
            set_=update_set,
        )
        db.execute(stmt)
    else:
        stmt = sqlite_insert(models.ActivePresence).values(**values).on_conflict_do_update(
            index_elements=["session_key"],
            set_=update_set,
        )
        db.execute(stmt)


@router.get("/status")
def get_presence_status(db: Session = Depends(get_db)):
    """Read current active online count and registered members count."""
    now_ts = int(time.time())
    return _read_presence_snapshot(db, now_ts)


@router.post("/ping")
def ping_presence(
    payload: PresencePingRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    """Record a browser heartbeat and return live online + registered member counts."""
    session_key = _sanitize_key(payload.session_key, "session_key")
    visitor_key = _sanitize_key(payload.visitor_key, "visitor_key") if payload.visitor_key else None
    user_id = _resolve_optional_user_id(request, db)

    if user_id is not None:
        identity_key = f"u:{user_id}"
    elif visitor_key:
        identity_key = f"v:{visitor_key}"
    else:
        identity_key = f"s:{session_key}"

    now_ts = int(time.time())
    _upsert_presence(db, session_key=session_key, identity_key=identity_key, now_ts=now_ts)

    # Periodically trim expired presence rows so the table stays tiny.
    if now_ts % 15 == 0:
        stale_cutoff = now_ts - PRUNE_TTL_SECONDS
        db.query(models.ActivePresence).filter(
            models.ActivePresence.last_seen_at < stale_cutoff
        ).delete(synchronize_session=False)

    db.commit()
    return _read_presence_snapshot(db, now_ts)


@router.post("/leave")
async def leave_presence(request: Request, db: Session = Depends(get_db)):
    """Remove a closed browser tab session cleanly via navigator.sendBeacon."""
    raw_body = await request.body()
    if not raw_body:
        return {"ok": True}

    try:
        parsed = json.loads(raw_body.decode("utf-8"))
    except (ValueError, UnicodeDecodeError):
        return {"ok": True}

    session_key_raw = parsed.get("session_key") if isinstance(parsed, dict) else None
    if not isinstance(session_key_raw, str):
        return {"ok": True}

    cleaned = session_key_raw.strip()
    if not _KEY_PATTERN.match(cleaned):
        return {"ok": True}

    db.query(models.ActivePresence).filter(
        models.ActivePresence.session_key == cleaned
    ).delete(synchronize_session=False)
    db.commit()
    return {"ok": True}
