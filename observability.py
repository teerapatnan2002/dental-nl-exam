"""Fail-safe observability & audit logging helpers (SQLite + Supabase PostgreSQL safe)."""

import json
import logging
import time
from typing import Any, Dict, Optional

from fastapi import Request
from sqlalchemy.orm import Session

import models

logger = logging.getLogger(__name__)


def mask_identifier(raw: Optional[str]) -> Optional[str]:
    """Mask email or username for PDPA-safe security event logging."""
    if not raw:
        return None
    s = raw.strip()
    if not s:
        return None
    if "@" in s:
        local, _, domain = s.partition("@")
        prefix = local[:2] if len(local) > 2 else local[:1]
        return f"{prefix}***@{domain}"[:120]
    prefix = s[:2] if len(s) > 2 else s[:1]
    return f"{prefix}***"[:120]


def extract_ip_and_ua(request: Optional[Request]) -> tuple[Optional[str], Optional[str]]:
    if request is None:
        return None, None
    fwd = request.headers.get("x-forwarded-for")
    if fwd:
        ip = fwd.split(",")[0].strip()[:64]
    elif request.client and request.client.host:
        ip = str(request.client.host)[:64]
    else:
        ip = None
    ua = (request.headers.get("user-agent") or "").strip()[:220] or None
    return ip, ua


def record_auth_event(
    db: Session,
    *,
    event_type: str,
    success: bool,
    request: Optional[Request] = None,
    user_id: Optional[int] = None,
    identifier: Optional[str] = None,
    detail: Optional[str] = None,
) -> None:
    """Persist an authentication/security event without ever breaking the caller flow."""
    try:
        ip, ua = extract_ip_and_ua(request)
        evt = models.AuthEvent(
            user_id=user_id,
            identifier_masked=mask_identifier(identifier),
            event_type=str(event_type)[:48],
            success=1 if success else 0,
            ip_address=ip,
            user_agent=ua,
            detail=(str(detail)[:160] if detail else None),
            created_at=int(time.time()),
        )
        with db.begin_nested():
            db.add(evt)
            db.flush()
        db.commit()
    except Exception as exc:
        logger.warning("Failed to record auth event (%s): %s", event_type, exc)


def record_admin_audit(
    db: Session,
    *,
    admin_id: Optional[int],
    action: str,
    target_type: str,
    target_id: Optional[Any] = None,
    details: Optional[Dict[str, Any]] = None,
    request: Optional[Request] = None,
) -> None:
    """Persist an immutable admin audit log entry safely."""
    try:
        ip, _ = extract_ip_and_ua(request)
        serialized = None
        if details is not None:
            serialized = json.dumps(details, ensure_ascii=False, default=str)[:4000]
        entry = models.AdminAuditLog(
            admin_id=admin_id,
            action=str(action)[:64],
            target_type=str(target_type)[:48],
            target_id=str(target_id)[:64] if target_id is not None else None,
            details_json=serialized,
            ip_address=ip,
            created_at=int(time.time()),
        )
        with db.begin_nested():
            db.add(entry)
            db.flush()
        db.commit()
    except Exception as exc:
        logger.warning("Failed to record admin audit (%s): %s", action, exc)


def record_ai_tutor_log(
    db: Session,
    *,
    user_id: Optional[int],
    question_id: Optional[int],
    topic_id: Optional[str],
    category: Optional[str],
    mode: str,
    model_used: Optional[str],
    suggested_tag: Optional[str],
    prompt_chars: int,
    response_chars: int,
    prompt_tokens: Optional[int],
    completion_tokens: Optional[int],
    total_tokens: Optional[int],
    latency_ms: int,
    status: str,
    error_code: Optional[str] = None,
) -> None:
    """Persist AI Tutor call telemetry without ever breaking chat responses."""
    try:
        row = models.AiTutorLog(
            user_id=user_id,
            question_id=question_id,
            topic_id=(str(topic_id)[:160] if topic_id else None),
            category=(str(category)[:160] if category else None),
            mode=str(mode)[:32],
            model_used=(str(model_used)[:120] if model_used else None),
            suggested_tag=(str(suggested_tag)[:64] if suggested_tag else None),
            prompt_chars=max(0, int(prompt_chars or 0)),
            response_chars=max(0, int(response_chars or 0)),
            prompt_tokens=int(prompt_tokens) if prompt_tokens is not None else None,
            completion_tokens=int(completion_tokens) if completion_tokens is not None else None,
            total_tokens=int(total_tokens) if total_tokens is not None else None,
            latency_ms=max(0, int(latency_ms or 0)),
            status=str(status)[:32],
            error_code=(str(error_code)[:120] if error_code else None),
            created_at=int(time.time()),
        )
        with db.begin_nested():
            db.add(row)
            db.flush()
        db.commit()
    except Exception as exc:
        logger.warning("Failed to record ai_tutor_log: %s", exc)
