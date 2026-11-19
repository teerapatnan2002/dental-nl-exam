import csv
import io
import json
import logging
import os
import statistics
import time
from collections import defaultdict
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response
from pydantic import BaseModel, Field
from sqlalchemy import and_, case, func
from sqlalchemy.orm import Session

import models
from auth import _sanitize_csv_cell, get_current_admin
from database import get_db
from observability import record_admin_audit
from presence import _read_presence_snapshot
from schema import ClinicalCategory, normalize_exam_session_label
from tos_blueprint import TOS_CATEGORIES, TZ_BKK

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/admin", tags=["admin"])

VALID_ROLES = {"user", "admin"}
VALID_SUBSCRIPTION_TIERS = {"free", "early_access", "pro_monthly", "pro_annual"}
VALID_SUBSCRIPTION_STATUSES = {"active", "trialing", "past_due", "canceled", "expired"}
VALID_CATEGORIES = {c.value for c in ClinicalCategory}

CAPPED_TIME_SECONDS = 300
OUTLIER_TIME_SECONDS = 600


class AdminUserUpdate(BaseModel):
    role: Optional[str] = Field(default=None, max_length=32)
    subscription_tier: Optional[str] = Field(default=None, max_length=32)
    subscription_status: Optional[str] = Field(default=None, max_length=32)
    subscription_expires_at: Optional[int] = Field(default=None, ge=0)
    clear_subscription_expires_at: bool = False


class AdminQuestionQuickEdit(BaseModel):
    correct_answer: Optional[str] = Field(default=None, max_length=16)
    category: Optional[str] = Field(default=None, max_length=120)
    must_know_topic: Optional[str] = Field(default=None, max_length=200)
    question_text: Optional[str] = Field(default=None, min_length=5, max_length=8000)
    explanation: Optional[str] = Field(default=None, max_length=20000)
    edit_reason: str = Field(..., min_length=2, max_length=500)
    report_id: Optional[int] = None
    resolve_report: bool = False
    admin_reply: Optional[str] = Field(default=None, max_length=2000)


class MarkSyncedRequest(BaseModel):
    edit_ids: List[int] = Field(default_factory=list)
    mark_all: bool = False


def _percentile(values: List[int], p: float) -> Optional[float]:
    if not values:
        return None
    ordered = sorted(values)
    if len(ordered) == 1:
        return float(ordered[0])
    idx = (len(ordered) - 1) * p
    lo = int(idx)
    hi = min(len(ordered) - 1, lo + 1)
    frac = idx - lo
    return round(ordered[lo] + (ordered[hi] - ordered[lo]) * frac, 1)


def _db_backend_label(db: Session) -> str:
    dialect_name = db.bind.dialect.name if db.bind is not None else ""
    if dialect_name == "postgresql":
        return "Supabase PostgreSQL"
    if dialect_name == "sqlite":
        return "Local SQLite"
    return dialect_name or "Unknown DB"


def _is_answered_sql():
    return and_(
        models.UserAnswer.selected_choice.isnot(None),
        func.trim(models.UserAnswer.selected_choice) != "",
    )


def _pct(num: float, den: float, digits: int = 1) -> Optional[float]:
    if not den:
        return None
    return round((float(num) / float(den)) * 100.0, digits)


def _median(values: List[int]) -> Optional[float]:
    if not values:
        return None
    return round(float(statistics.median(values)), 1)


def _normalize_unix_sec(ts: Optional[int]) -> Optional[int]:
    """Normalize Unix timestamp to seconds, gracefully handling legacy millisecond values."""
    if ts is None:
        return None
    val = int(ts)
    if val <= 0:
        return None
    if val > 10_000_000_000:
        val //= 1000
    return val


def _normalized_ts_sql(col):
    """Dialect-safe SQL expression normalizing 13-digit Unix ms timestamps to seconds."""
    return case((col > 10_000_000_000, col / 1000), else_=col)


def _bkk_date_str(unix_ts: int) -> str:
    sec = _normalize_unix_sec(unix_ts)
    return datetime.fromtimestamp(sec or 0, tz=TZ_BKK).strftime("%Y-%m-%d")


def _bkk_hour(unix_ts: int) -> int:
    sec = _normalize_unix_sec(unix_ts)
    return datetime.fromtimestamp(sec or 0, tz=TZ_BKK).hour


def _format_bkk_iso(unix_ts: Optional[int]) -> str:
    sec = _normalize_unix_sec(unix_ts)
    if not sec:
        return "-"
    try:
        return datetime.fromtimestamp(sec, tz=TZ_BKK).strftime("%Y-%m-%d %H:%M:%S")
    except Exception:
        return str(unix_ts)


def _resolve_image_fs_root() -> Optional[str]:
    """Return a local image directory if available on disk; None on serverless CDN builds."""
    for candidate in ("frontend/public/images", "images"):
        if os.path.isdir(candidate):
            try:
                with os.scandir(candidate) as entries:
                    if any(entries):
                        return candidate
            except OSError:
                continue
    return None


def _check_image_path_valid(raw_path: Optional[str], fs_root: Optional[str]) -> bool:
    """Validate image_path format (single path or JSON list) and optionally verify file on disk."""
    if raw_path is None:
        return True
    cleaned = raw_path.strip()
    if not cleaned:
        return True

    paths: List[str]
    if cleaned.startswith("["):
        try:
            parsed = json.loads(cleaned)
        except Exception:
            return False
        if not isinstance(parsed, list) or not parsed:
            return False
        if not all(isinstance(p, str) and p.strip() for p in parsed):
            return False
        paths = [p.strip() for p in parsed]
    else:
        paths = [cleaned]

    for p in paths:
        if ".." in p or p.startswith("javascript:") or p.startswith("data:"):
            return False
        if p.startswith("http://") or p.startswith("https://"):
            continue
        rel = p.lstrip("/")
        if rel.startswith("images/"):
            rel_sub = rel[len("images/"):]
        else:
            rel_sub = rel
        if not rel_sub:
            return False
        if fs_root is not None:
            candidate_a = os.path.join(fs_root, rel_sub)
            candidate_b = os.path.join("images", rel_sub)
            candidate_c = os.path.join("frontend/public/images", rel_sub)
            if not (os.path.exists(candidate_a) or os.path.exists(candidate_b) or os.path.exists(candidate_c)):
                return False
    return True


def _build_user_engagement_rows(
    db: Session,
    *,
    now_ts: int,
    search: Optional[str] = None,
    role: Optional[str] = None,
    tier: Optional[str] = None,
    activity: str = "all",
    sort: str = "newest",
) -> Dict[str, Any]:
    """Aggregate per-user engagement metrics via grouped queries (zero N+1)."""
    users = db.query(models.User).order_by(models.User.id.asc()).all()

    last_session_expr = _normalized_ts_sql(
        func.coalesce(models.ExamSession.end_time, models.ExamSession.start_time)
    )
    session_rows = (
        db.query(
            models.ExamSession.user_id,
            func.count(models.ExamSession.id),
            func.max(last_session_expr),
        )
        .group_by(models.ExamSession.user_id)
        .all()
    )
    session_map = {
        uid: {
            "sessions_count": int(cnt or 0),
            "last_session_at": _normalize_unix_sec(last_ts),
        }
        for uid, cnt, last_ts in session_rows
    }

    answered_cond = _is_answered_sql()
    answer_rows = (
        db.query(
            models.ExamSession.user_id,
            func.count(models.UserAnswer.id),
            func.sum(case((answered_cond, 1), else_=0)),
            func.sum(case((and_(answered_cond, models.UserAnswer.is_correct == 1), 1), else_=0)),
        )
        .join(models.ExamSession, models.UserAnswer.session_id == models.ExamSession.id)
        .group_by(models.ExamSession.user_id)
        .all()
    )
    answer_map = {
        uid: {
            "total_answer_rows": int(total or 0),
            "answered_count": int(answered or 0),
            "correct_answered": int(correct or 0),
        }
        for uid, total, answered, correct in answer_rows
    }

    bookmark_map = {
        uid: int(cnt or 0)
        for uid, cnt in db.query(models.Bookmark.user_id, func.count(models.Bookmark.id))
        .group_by(models.Bookmark.user_id)
        .all()
    }
    qnote_map = {
        uid: int(cnt or 0)
        for uid, cnt in db.query(models.UserNote.user_id, func.count(models.UserNote.id))
        .group_by(models.UserNote.user_id)
        .all()
    }
    tnote_map = {
        uid: int(cnt or 0)
        for uid, cnt in db.query(models.UserTopicNote.user_id, func.count(models.UserTopicNote.id))
        .group_by(models.UserTopicNote.user_id)
        .all()
    }
    sm2_rows = (
        db.query(
            models.UserQuestionStat.user_id,
            func.sum(case((models.UserQuestionStat.next_review_date <= now_ts, 1), else_=0)),
            func.max(models.UserQuestionStat.last_reviewed_at),
        )
        .group_by(models.UserQuestionStat.user_id)
        .all()
    )
    sm2_map = {
        uid: {
            "sm2_due_count": int(due_cnt or 0),
            "last_sm2_at": int(last_rev) if last_rev else None,
        }
        for uid, due_cnt, last_rev in sm2_rows
    }

    items: List[Dict[str, Any]] = []
    q_search = (search or "").strip().lower()

    for u in users:
        s_info = session_map.get(u.id, {"sessions_count": 0, "last_session_at": None})
        a_info = answer_map.get(u.id, {"total_answer_rows": 0, "answered_count": 0, "correct_answered": 0})
        sm2_info = sm2_map.get(u.id, {"sm2_due_count": 0, "last_sm2_at": None})

        last_candidates = [ts for ts in (s_info["last_session_at"], sm2_info["last_sm2_at"]) if ts]
        last_active_at = max(last_candidates) if last_candidates else None

        sessions_count = s_info["sessions_count"]
        total_rows = a_info["total_answer_rows"]
        answered_count = a_info["answered_count"]
        correct_answered = a_info["correct_answered"]

        item = {
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "display_name": u.display_name,
            "role": u.role,
            "created_at": u.created_at,
            "dental_school": u.dental_school,
            "academic_year": u.academic_year,
            "target_exam_session": normalize_exam_session_label(u.target_exam_session),
            "target_score_pct": u.target_score_pct,
            "daily_goal_questions": u.daily_goal_questions,
            "subscription_tier": u.subscription_tier,
            "subscription_status": u.subscription_status,
            "subscription_expires_at": u.subscription_expires_at,
            "two_factor_enabled": bool(u.two_factor_enabled),
            "sessions_count": sessions_count,
            "total_answer_rows": total_rows,
            "answered_count": answered_count,
            "answered_rate_pct": _pct(answered_count, total_rows),
            "true_accuracy_pct": _pct(correct_answered, answered_count),
            "last_active_at": last_active_at,
            "bookmarks_count": bookmark_map.get(u.id, 0),
            "notes_count": qnote_map.get(u.id, 0) + tnote_map.get(u.id, 0),
            "sm2_due_count": sm2_info["sm2_due_count"],
        }

        if q_search:
            haystack = " ".join(
                str(v or "").lower()
                for v in (item["username"], item["email"], item["display_name"], item["dental_school"])
            )
            if q_search not in haystack:
                continue
        if role and role != "all" and item["role"] != role:
            continue
        if tier and tier != "all" and item["subscription_tier"] != tier:
            continue
        if activity == "active" and sessions_count <= 0:
            continue
        if activity == "inactive" and sessions_count > 0:
            continue

        items.append(item)

    if sort == "sessions":
        items.sort(key=lambda r: (r["sessions_count"], r["answered_count"], r["id"]), reverse=True)
    elif sort == "answered":
        items.sort(key=lambda r: (r["answered_count"], r["sessions_count"], r["id"]), reverse=True)
    elif sort == "accuracy":
        items.sort(
            key=lambda r: (
                r["true_accuracy_pct"] is not None,
                r["true_accuracy_pct"] if r["true_accuracy_pct"] is not None else -1.0,
                r["answered_count"],
            ),
            reverse=True,
        )
    elif sort == "last_active":
        items.sort(
            key=lambda r: (
                r["last_active_at"] is not None,
                r["last_active_at"] or 0,
                r["created_at"] or 0,
            ),
            reverse=True,
        )
    else:  # newest
        items.sort(key=lambda r: (r["created_at"] or 0, r["id"]), reverse=True)

    summary = {
        "total_users": len(users),
        "total_matched": len(items),
        "active_count": sum(1 for r in items if r["sessions_count"] > 0),
        "two_factor_count": sum(1 for r in items if r["two_factor_enabled"]),
        "admin_count": sum(1 for r in items if r["role"] == "admin"),
    }
    return {"items": items, "summary": summary}


# ── 1. Overview & Growth KPIs ──

@router.get("/overview")
def get_admin_overview(
    days: int = Query(30, ge=7, le=365),
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Executive overview KPIs, daily trends, peak hours, mode split & cohort health."""
    now_ts = int(time.time())
    now_bkk = datetime.fromtimestamp(now_ts, tz=TZ_BKK)
    start_bkk = (now_bkk - timedelta(days=days - 1)).replace(hour=0, minute=0, second=0, microsecond=0)
    cutoff_ts = int(start_bkk.timestamp())

    # Users metadata
    user_rows = (
        db.query(
            models.User.id,
            models.User.created_at,
            models.User.role,
            models.User.dental_school,
            models.User.target_exam_session,
            models.User.two_factor_enabled,
            models.User.subscription_tier,
        )
        .all()
    )
    total_users = len(user_rows)
    new_users_period = 0
    two_factor_count = 0
    dental_school_filled = 0
    admin_count = 0
    cohort_counts: Dict[str, int] = defaultdict(int)
    tier_counts: Dict[str, int] = defaultdict(int)
    daily_signups: Dict[str, int] = defaultdict(int)

    for uid, created_at, role, school, target_session, two_fa, sub_tier in user_rows:
        if role == "admin":
            admin_count += 1
        if two_fa:
            two_factor_count += 1
        if school and school.strip():
            dental_school_filled += 1
        cohort_counts[normalize_exam_session_label(target_session) or "ไม่ระบุ"] += 1
        tier_counts[sub_tier or "unknown"] += 1
        created_sec = _normalize_unix_sec(created_at)
        if created_sec and created_sec >= cutoff_ts:
            new_users_period += 1
            daily_signups[_bkk_date_str(created_sec)] += 1

    # Exam sessions
    session_rows = (
        db.query(
            models.ExamSession.id,
            models.ExamSession.user_id,
            models.ExamSession.start_time,
            models.ExamSession.end_time,
            models.ExamSession.exam_type,
            models.ExamSession.time_limit_seconds,
        )
        .all()
    )
    total_sessions = len(session_rows)
    sessions_period = 0
    all_active_users = set()
    period_active_users = set()
    daily_sessions: Dict[str, int] = defaultdict(int)
    hourly_sessions: Dict[int, int] = defaultdict(int)
    mode_counts: Dict[str, int] = defaultdict(int)
    timed_count = 0
    untimed_count = 0
    completed_sessions = 0

    for sid, uid, start_ts, end_ts, exam_type, time_limit in session_rows:
        all_active_users.add(uid)
        if end_ts is not None:
            completed_sessions += 1
        if time_limit is not None:
            timed_count += 1
        else:
            untimed_count += 1
        mode_counts[(exam_type or "unknown").lower()] += 1
        start_sec = _normalize_unix_sec(start_ts)
        if start_sec:
            hourly_sessions[_bkk_hour(start_sec)] += 1
            if start_sec >= cutoff_ts:
                sessions_period += 1
                period_active_users.add(uid)
                daily_sessions[_bkk_date_str(start_sec)] += 1

    # Answers (all-time + period daily answered)
    answered_cond = _is_answered_sql()
    total_answer_rows, answered_count, correct_answered = (
        db.query(
            func.count(models.UserAnswer.id),
            func.sum(case((answered_cond, 1), else_=0)),
            func.sum(case((and_(answered_cond, models.UserAnswer.is_correct == 1), 1), else_=0)),
        )
        .one()
    )
    total_answer_rows = int(total_answer_rows or 0)
    answered_count = int(answered_count or 0)
    correct_answered = int(correct_answered or 0)

    norm_start_sql = _normalized_ts_sql(models.ExamSession.start_time)
    period_answer_timestamps = (
        db.query(norm_start_sql)
        .join(models.UserAnswer, models.UserAnswer.session_id == models.ExamSession.id)
        .filter(norm_start_sql >= cutoff_ts, answered_cond)
        .all()
    )
    daily_answered: Dict[str, int] = defaultdict(int)
    for (s_ts,) in period_answer_timestamps:
        s_sec = _normalize_unix_sec(s_ts)
        if s_sec:
            daily_answered[_bkk_date_str(s_sec)] += 1

    # Open reports & total questions
    open_reports_count = (
        db.query(func.count(models.ReportedQuestion.id))
        .filter(models.ReportedQuestion.status.in_(["pending", "reviewing"]))
        .scalar()
        or 0
    )
    total_questions = db.query(func.count(models.Question.id)).scalar() or 0
    pending_sync_edits_count = (
        db.query(func.count(models.QuestionEditLog.id))
        .filter(models.QuestionEditLog.sync_status == "pending_sync")
        .scalar()
        or 0
    )

    # Live presence
    presence = _read_presence_snapshot(db, now_ts)

    # Zero-filled daily series for exact `days` days in BKK timezone
    daily_series = []
    for offset in range(days):
        day_str = (start_bkk + timedelta(days=offset)).strftime("%Y-%m-%d")
        daily_series.append(
            {
                "date": day_str,
                "signups": daily_signups.get(day_str, 0),
                "sessions": daily_sessions.get(day_str, 0),
                "answered": daily_answered.get(day_str, 0),
            }
        )

    peak_hours = [{"hour": h, "sessions": hourly_sessions.get(h, 0)} for h in range(24)]

    cohorts = [
        {"label": label, "count": cnt, "pct": _pct(cnt, total_users) or 0.0}
        for label, cnt in sorted(cohort_counts.items(), key=lambda kv: (-kv[1], kv[0]))
    ]
    tiers = [
        {"tier": t, "count": cnt, "pct": _pct(cnt, total_users) or 0.0}
        for t, cnt in sorted(tier_counts.items(), key=lambda kv: (-kv[1], kv[0]))
    ]
    mode_split = [
        {"mode": mode, "count": cnt, "pct": _pct(cnt, total_sessions) or 0.0}
        for mode, cnt in sorted(mode_counts.items(), key=lambda kv: (-kv[1], kv[0]))
    ]

    return {
        "days": days,
        "generated_at": now_ts,
        "db_backend_label": _db_backend_label(db),
        "kpis": {
            "total_users": total_users,
            "new_users_period": new_users_period,
            "active_users_all_time": len(all_active_users),
            "active_users_period": len(period_active_users),
            "activation_rate_pct": _pct(len(all_active_users), total_users) or 0.0,
            "online_users_now": presence["online_count"],
            "online_window_seconds": presence["window_seconds"],
            "total_sessions": total_sessions,
            "completed_sessions": completed_sessions,
            "sessions_period": sessions_period,
            "total_answer_rows": total_answer_rows,
            "answered_count": answered_count,
            "blank_count": max(0, total_answer_rows - answered_count),
            "answered_rate_pct": _pct(answered_count, total_answer_rows) or 0.0,
            "true_accuracy_pct": _pct(correct_answered, answered_count),
            "open_reports_count": int(open_reports_count),
            "pending_sync_edits_count": int(pending_sync_edits_count),
            "total_questions": int(total_questions),
        },
        "daily_series": daily_series,
        "peak_hours": peak_hours,
        "mode_split": mode_split,
        "timing_split": {
            "timed": timed_count,
            "untimed": untimed_count,
        },
        "cohorts": cohorts,
        "tiers": tiers,
        "profile_health": {
            "admin_count": admin_count,
            "two_factor_enabled_count": two_factor_count,
            "two_factor_rate_pct": _pct(two_factor_count, total_users) or 0.0,
            "dental_school_filled": dental_school_filled,
            "dental_school_rate_pct": _pct(dental_school_filled, total_users) or 0.0,
        },
    }


# ── 2. Users & Access Management ──

@router.get("/users")
def get_admin_users(
    search: Optional[str] = Query(None, max_length=120),
    role: Optional[str] = Query(None, max_length=32),
    tier: Optional[str] = Query(None, max_length=32),
    activity: str = Query("all", pattern="^(all|active|inactive)$"),
    sort: str = Query("newest", pattern="^(newest|sessions|answered|accuracy|last_active)$"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Searchable, filterable, sortable user engagement table (admin only)."""
    now_ts = int(time.time())
    built = _build_user_engagement_rows(
        db,
        now_ts=now_ts,
        search=search,
        role=role,
        tier=tier,
        activity=activity,
        sort=sort,
    )
    items = built["items"]
    return {
        "summary": built["summary"],
        "limit": limit,
        "offset": offset,
        "items": items[offset : offset + limit],
    }


@router.patch("/users/{user_id}")
def update_admin_user(
    user_id: int,
    payload: AdminUserUpdate,
    request: Request,
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Update a user's role or subscription entitlement (admin only, self-demotion guarded)."""
    target = db.query(models.User).filter(models.User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="ไม่พบผู้ใช้งานที่ระบุ")

    changes: Dict[str, Any] = {}

    if payload.role is not None:
        clean_role = payload.role.strip().lower()
        if clean_role not in VALID_ROLES:
            raise HTTPException(status_code=400, detail=f"role ไม่ถูกต้อง (อนุญาตเฉพาะ {sorted(VALID_ROLES)})")
        if target.id == admin.id and clean_role != "admin":
            raise HTTPException(status_code=400, detail="ไม่สามารถลดสิทธิ์ผู้ดูแลระบบของบัญชีตนเองได้")
        if target.role != clean_role:
            changes["role"] = (target.role, clean_role)
            target.role = clean_role

    if payload.subscription_tier is not None:
        clean_tier = payload.subscription_tier.strip().lower()
        if clean_tier not in VALID_SUBSCRIPTION_TIERS:
            raise HTTPException(
                status_code=400,
                detail=f"subscription_tier ไม่ถูกต้อง (อนุญาตเฉพาะ {sorted(VALID_SUBSCRIPTION_TIERS)})",
            )
        if target.subscription_tier != clean_tier:
            changes["subscription_tier"] = (target.subscription_tier, clean_tier)
            target.subscription_tier = clean_tier

    if payload.subscription_status is not None:
        clean_status = payload.subscription_status.strip().lower()
        if clean_status not in VALID_SUBSCRIPTION_STATUSES:
            raise HTTPException(
                status_code=400,
                detail=f"subscription_status ไม่ถูกต้อง (อนุญาตเฉพาะ {sorted(VALID_SUBSCRIPTION_STATUSES)})",
            )
        if target.subscription_status != clean_status:
            changes["subscription_status"] = (target.subscription_status, clean_status)
            target.subscription_status = clean_status

    if payload.clear_subscription_expires_at:
        if target.subscription_expires_at is not None:
            changes["subscription_expires_at"] = (target.subscription_expires_at, None)
            target.subscription_expires_at = None
    elif payload.subscription_expires_at is not None:
        if target.subscription_expires_at != payload.subscription_expires_at:
            changes["subscription_expires_at"] = (target.subscription_expires_at, payload.subscription_expires_at)
            target.subscription_expires_at = payload.subscription_expires_at

    if changes:
        db.add(target)
        db.commit()
        db.refresh(target)
        logger.info(
            "Admin user update: admin_id=%s target_user_id=%s changes=%s",
            admin.id,
            target.id,
            changes,
        )
        record_admin_audit(
            db,
            admin_id=admin.id,
            action="admin_user_update",
            target_type="user",
            target_id=target.id,
            details={
                "target_username": target.username,
                "changes": {k: {"before": v[0], "after": v[1]} for k, v in changes.items()},
            },
            request=request,
        )

    return {
        "id": target.id,
        "username": target.username,
        "email": target.email,
        "role": target.role,
        "subscription_tier": target.subscription_tier,
        "subscription_status": target.subscription_status,
        "subscription_expires_at": target.subscription_expires_at,
        "updated_fields": sorted(changes.keys()),
    }


@router.get("/users/export")
def export_admin_users_csv(
    request: Request,
    search: Optional[str] = Query(None, max_length=120),
    role: Optional[str] = Query(None, max_length=32),
    tier: Optional[str] = Query(None, max_length=32),
    activity: str = Query("all", pattern="^(all|active|inactive)$"),
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Export enriched user engagement table as UTF-8 BOM CSV with formula-injection protection."""
    now_ts = int(time.time())
    built = _build_user_engagement_rows(
        db,
        now_ts=now_ts,
        search=search,
        role=role,
        tier=tier,
        activity=activity,
        sort="newest",
    )
    record_admin_audit(
        db,
        admin_id=admin.id,
        action="admin_users_export",
        target_type="users_csv",
        details={
            "row_count": len(built["items"]),
            "filters": {"search": search, "role": role, "tier": tier, "activity": activity},
        },
        request=request,
    )

    output = io.StringIO()
    output.write("\ufeff")
    writer = csv.writer(output)
    writer.writerow([
        "id",
        "username",
        "email",
        "display_name",
        "role",
        "subscription_tier",
        "subscription_status",
        "subscription_expires_at",
        "two_factor_enabled",
        "target_exam_session",
        "dental_school",
        "academic_year",
        "registered_at_bkk",
        "last_active_at_bkk",
        "sessions_count",
        "total_answer_rows",
        "answered_count",
        "answered_rate_pct",
        "true_accuracy_pct",
        "bookmarks_count",
        "notes_count",
        "sm2_due_count",
    ])

    for r in built["items"]:
        writer.writerow([
            r["id"],
            _sanitize_csv_cell(r["username"]),
            _sanitize_csv_cell(r["email"]),
            _sanitize_csv_cell(r["display_name"] or ""),
            _sanitize_csv_cell(r["role"]),
            _sanitize_csv_cell(r["subscription_tier"]),
            _sanitize_csv_cell(r["subscription_status"]),
            _format_bkk_iso(r["subscription_expires_at"]),
            "yes" if r["two_factor_enabled"] else "no",
            _sanitize_csv_cell(r["target_exam_session"] or ""),
            _sanitize_csv_cell(r["dental_school"] or ""),
            _sanitize_csv_cell(r["academic_year"] or ""),
            _format_bkk_iso(r["created_at"]),
            _format_bkk_iso(r["last_active_at"]),
            r["sessions_count"],
            r["total_answer_rows"],
            r["answered_count"],
            "" if r["answered_rate_pct"] is None else r["answered_rate_pct"],
            "" if r["true_accuracy_pct"] is None else r["true_accuracy_pct"],
            r["bookmarks_count"],
            r["notes_count"],
            r["sm2_due_count"],
        ])

    today_str = datetime.fromtimestamp(now_ts, tz=TZ_BKK).strftime("%Y-%m-%d")
    return Response(
        content=output.getvalue(),
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": f"attachment; filename=admin_users_engagement_{today_str}.csv"},
    )


# ── 3. Exam Psychometrics & Distractor Analysis ──

@router.get("/psychometrics")
def get_admin_psychometrics(
    days: int = Query(90, ge=7, le=3650),
    min_attempts: int = Query(3, ge=1, le=100),
    category: Optional[str] = Query(None, max_length=120),
    exam_origin: Optional[str] = Query(None, max_length=64),
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """
    Category & question psychometrics with strict separation of Answered Rate vs True Accuracy,
    Median & Capped-300s timing (eliminating idle tab outliers), and Distractor Analysis.
    """
    now_ts = int(time.time())
    cutoff_ts = now_ts - (days * 86400)

    norm_start_sql = _normalized_ts_sql(models.ExamSession.start_time)
    q = (
        db.query(
            models.UserAnswer.question_id,
            models.UserAnswer.selected_choice,
            models.UserAnswer.is_correct,
            models.UserAnswer.time_spent_seconds,
            models.Question.category,
            models.Question.correct_answer,
            models.Question.source_exam,
            models.Question.exam_origin,
            models.Question.must_know_topic,
            models.Question.question_text,
        )
        .join(models.ExamSession, models.UserAnswer.session_id == models.ExamSession.id)
        .join(models.Question, models.UserAnswer.question_id == models.Question.id)
        .filter(norm_start_sql >= cutoff_ts)
    )
    if category and category != "all":
        q = q.filter(models.Question.category == category)
    if exam_origin and exam_origin != "all":
        q = q.filter(models.Question.exam_origin == exam_origin)

    rows = q.all()

    # Seed category buckets in TOS blueprint order
    ordered_categories = [item["category"] for item in TOS_CATEGORIES]
    cat_stats: Dict[str, Dict[str, Any]] = {
        cat: {
            "category": cat,
            "total_rows": 0,
            "answered_count": 0,
            "blank_count": 0,
            "correct_answered": 0,
            "times_all": [],
            "times_capped": [],
            "outlier_count_gt_600s": 0,
        }
        for cat in ordered_categories
    }

    overall_total = 0
    overall_answered = 0
    overall_correct = 0
    overall_times_all: List[int] = []
    overall_times_capped: List[int] = []
    overall_outliers = 0

    q_stats: Dict[int, Dict[str, Any]] = {}

    for (
        qid,
        selected_choice,
        is_correct,
        time_sec,
        q_cat,
        correct_ans,
        source_exam,
        q_origin,
        must_know,
        q_text,
    ) in rows:
        if q_cat not in cat_stats:
            cat_stats[q_cat] = {
                "category": q_cat,
                "total_rows": 0,
                "answered_count": 0,
                "blank_count": 0,
                "correct_answered": 0,
                "times_all": [],
                "times_capped": [],
                "outlier_count_gt_600s": 0,
            }

        c_bucket = cat_stats[q_cat]
        c_bucket["total_rows"] += 1
        overall_total += 1

        sel_clean = (selected_choice or "").strip().upper()
        is_answered = bool(sel_clean)
        ans_clean = (correct_ans or "").strip().upper()

        if qid not in q_stats:
            q_stats[qid] = {
                "question_id": qid,
                "category": q_cat,
                "source_exam": source_exam,
                "exam_origin": q_origin,
                "must_know_topic": must_know,
                "question_preview": (q_text or "").strip()[:180],
                "correct_answer": ans_clean or None,
                "total_rows": 0,
                "answered_count": 0,
                "correct_answered": 0,
                "choice_counts": defaultdict(int),
                "times_all": [],
            }
        qb = q_stats[qid]
        qb["total_rows"] += 1

        if is_answered:
            c_bucket["answered_count"] += 1
            overall_answered += 1
            qb["answered_count"] += 1
            qb["choice_counts"][sel_clean] += 1
            if int(is_correct or 0) == 1:
                c_bucket["correct_answered"] += 1
                overall_correct += 1
                qb["correct_answered"] += 1
        else:
            c_bucket["blank_count"] += 1

        if time_sec is not None and time_sec > 0:
            t_val = int(time_sec)
            c_bucket["times_all"].append(t_val)
            overall_times_all.append(t_val)
            qb["times_all"].append(t_val)
            if t_val <= CAPPED_TIME_SECONDS:
                c_bucket["times_capped"].append(t_val)
                overall_times_capped.append(t_val)
            if t_val > OUTLIER_TIME_SECONDS:
                c_bucket["outlier_count_gt_600s"] += 1
                overall_outliers += 1

    categories_out = []
    for cat_name, st in cat_stats.items():
        if category and category != "all" and cat_name != category:
            continue
        capped_avg = (
            round(sum(st["times_capped"]) / len(st["times_capped"]), 1)
            if st["times_capped"]
            else None
        )
        categories_out.append(
            {
                "category": cat_name,
                "total_rows": st["total_rows"],
                "answered_count": st["answered_count"],
                "blank_count": st["blank_count"],
                "answered_rate_pct": _pct(st["answered_count"], st["total_rows"]),
                "true_accuracy_pct": _pct(st["correct_answered"], st["answered_count"]),
                "median_time_sec": _median(st["times_all"]),
                "capped_avg_time_sec": capped_avg,
                "outlier_count_gt_600s": st["outlier_count_gt_600s"],
            }
        )

    # Hardest questions & distractor alerts (only with answered_count >= min_attempts)
    eligible = [qb for qb in q_stats.values() if qb["answered_count"] >= min_attempts]

    hardest_questions = []
    distractor_alerts = []

    for qb in eligible:
        acc = _pct(qb["correct_answered"], qb["answered_count"]) or 0.0
        med_t = _median(qb["times_all"])
        hardest_questions.append(
            {
                "question_id": qb["question_id"],
                "category": qb["category"],
                "source_exam": qb["source_exam"],
                "exam_origin": qb["exam_origin"],
                "must_know_topic": qb["must_know_topic"],
                "question_preview": qb["question_preview"],
                "correct_answer": qb["correct_answer"],
                "answered_count": qb["answered_count"],
                "true_accuracy_pct": acc,
                "median_time_sec": med_t,
            }
        )

        # Distractor check: a wrong choice picked strictly more often than keyed correct_answer
        key = qb["correct_answer"]
        if key:
            choice_counts = qb["choice_counts"]
            key_count = choice_counts.get(key, 0)
            wrong_choices = [(lbl, cnt) for lbl, cnt in choice_counts.items() if lbl != key]
            if wrong_choices:
                top_wrong_lbl, top_wrong_cnt = max(wrong_choices, key=lambda kv: (kv[1], kv[0]))
                if top_wrong_cnt > key_count:
                    dist = [
                        {
                            "label": lbl,
                            "count": cnt,
                            "pct": _pct(cnt, qb["answered_count"]) or 0.0,
                            "is_correct": lbl == key,
                            "is_top_distractor": lbl == top_wrong_lbl,
                        }
                        for lbl, cnt in sorted(choice_counts.items(), key=lambda kv: kv[0])
                    ]
                    distractor_alerts.append(
                        {
                            "question_id": qb["question_id"],
                            "category": qb["category"],
                            "source_exam": qb["source_exam"],
                            "must_know_topic": qb["must_know_topic"],
                            "question_preview": qb["question_preview"],
                            "correct_answer": key,
                            "answered_count": qb["answered_count"],
                            "correct_choice_count": key_count,
                            "correct_choice_pct": _pct(key_count, qb["answered_count"]) or 0.0,
                            "top_distractor_label": top_wrong_lbl,
                            "top_distractor_count": top_wrong_cnt,
                            "top_distractor_pct": _pct(top_wrong_cnt, qb["answered_count"]) or 0.0,
                            "choice_distribution": dist,
                        }
                    )

    hardest_questions.sort(key=lambda r: (r["true_accuracy_pct"], -r["answered_count"], r["question_id"]))
    distractor_alerts.sort(
        key=lambda r: (
            -(r["top_distractor_count"] - r["correct_choice_count"]),
            -r["answered_count"],
            r["question_id"],
        )
    )

    overall_capped_avg = (
        round(sum(overall_times_capped) / len(overall_times_capped), 1)
        if overall_times_capped
        else None
    )

    return {
        "filters": {
            "days": days,
            "min_attempts": min_attempts,
            "category": category or "all",
            "exam_origin": exam_origin or "all",
        },
        "summary": {
            "total_rows": overall_total,
            "answered_count": overall_answered,
            "blank_count": max(0, overall_total - overall_answered),
            "answered_rate_pct": _pct(overall_answered, overall_total),
            "true_accuracy_pct": _pct(overall_correct, overall_answered),
            "median_time_sec": _median(overall_times_all),
            "capped_avg_time_sec": overall_capped_avg,
            "capped_threshold_sec": CAPPED_TIME_SECONDS,
            "outlier_count_gt_600s": overall_outliers,
            "eligible_questions_count": len(eligible),
        },
        "categories": categories_out,
        "hardest_questions": hardest_questions[:20],
        "distractor_alerts": distractor_alerts[:20],
    }


# ── 4. Content Health & Feature Adoption ──

@router.get("/content-health")
def get_admin_content_health(
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Bank coverage vs TOS, automated 6-rule data integrity audit, and feature adoption / SM-2 health."""
    now_ts = int(time.time())
    fs_root = _resolve_image_fs_root()

    q_rows = (
        db.query(
            models.Question.id,
            models.Question.category,
            models.Question.exam_origin,
            models.Question.cognitive_level,
            models.Question.must_know_topic,
            models.Question.correct_answer,
            models.Question.explanation,
            models.Question.image_path,
        )
        .order_by(models.Question.id.asc())
        .all()
    )

    # Fetch choice labels grouped in memory (single lean query)
    choice_labels_by_q: Dict[int, set] = defaultdict(set)
    for qid, lbl in db.query(models.Choice.question_id, models.Choice.label).all():
        if lbl:
            choice_labels_by_q[qid].add(lbl.strip().upper())

    origin_counts: Dict[str, int] = defaultdict(int)
    cognitive_counts: Dict[str, int] = defaultdict(int)
    real_cat_counts: Dict[str, int] = defaultdict(int)
    total_cat_counts: Dict[str, int] = defaultdict(int)

    missing_explanation_ids: List[int] = []
    invalid_explanation_json_ids: List[int] = []
    missing_must_know_ids: List[int] = []
    invalid_correct_answer_ids: List[int] = []
    low_choice_count_ids: List[int] = []
    invalid_image_path_ids: List[int] = []
    questions_with_images = 0

    for qid, cat, origin, cog, topic, ans, expl, img_path in q_rows:
        origin_key = origin or "unknown"
        origin_counts[origin_key] += 1
        total_cat_counts[cat] += 1
        if origin_key == "real_exam":
            real_cat_counts[cat] += 1
            if not topic or not topic.strip():
                missing_must_know_ids.append(qid)

        cog_key = (cog or "unset").strip().upper() if cog and cog.strip() else "unset"
        cognitive_counts[cog_key] += 1

        # Explanation checks
        if not expl or not expl.strip():
            missing_explanation_ids.append(qid)
        else:
            stripped = expl.strip()
            if stripped.startswith("{"):
                try:
                    parsed_expl = json.loads(stripped)
                    if not isinstance(parsed_expl, dict):
                        invalid_explanation_json_ids.append(qid)
                except Exception:
                    invalid_explanation_json_ids.append(qid)

        # Choices & correct_answer checks (skip duplicate_archive if needed? Check all to be thorough)
        labels = choice_labels_by_q.get(qid, set())
        if len(labels) < 4:
            low_choice_count_ids.append(qid)
        ans_clean = (ans or "").strip().upper()
        if not ans_clean or (labels and ans_clean not in labels):
            invalid_correct_answer_ids.append(qid)

        # Image path checks
        if img_path and img_path.strip():
            questions_with_images += 1
            if not _check_image_path_valid(img_path, fs_root):
                invalid_image_path_ids.append(qid)

    real_exam_total = origin_counts.get("real_exam", 0)
    tos_coverage = []
    for item in TOS_CATEGORIES:
        cat_name = item["category"]
        real_cnt = real_cat_counts.get(cat_name, 0)
        actual_pct = _pct(real_cnt, real_exam_total, digits=2) or 0.0
        target_pct = float(item["target_pct"])
        tos_coverage.append(
            {
                "category": cat_name,
                "real_exam_count": real_cnt,
                "total_count": total_cat_counts.get(cat_name, 0),
                "actual_pct": actual_pct,
                "target_pct": target_pct,
                "delta_pct": round(actual_pct - target_pct, 2),
            }
        )

    integrity_checks = [
        {
            "key": "invalid_correct_answer",
            "label": "เฉลยไม่ตรงกับตัวเลือก (Invalid Correct Answer)",
            "severity": "critical" if invalid_correct_answer_ids else "pass",
            "count": len(invalid_correct_answer_ids),
            "sample_ids": invalid_correct_answer_ids[:25],
        },
        {
            "key": "invalid_explanation_json",
            "label": "รูปแบบ JSON คำอธิบายเสียหาย (Invalid Explanation JSON)",
            "severity": "critical" if invalid_explanation_json_ids else "pass",
            "count": len(invalid_explanation_json_ids),
            "sample_ids": invalid_explanation_json_ids[:25],
        },
        {
            "key": "low_choice_count",
            "label": "ข้อสอบที่มีตัวเลือกน้อยกว่า 4 ข้อ",
            "severity": "warning" if low_choice_count_ids else "pass",
            "count": len(low_choice_count_ids),
            "sample_ids": low_choice_count_ids[:25],
        },
        {
            "key": "missing_explanation",
            "label": "ยังไม่มีคำอธิบายเฉลย (Missing Explanation)",
            "severity": "warning" if missing_explanation_ids else "pass",
            "count": len(missing_explanation_ids),
            "sample_ids": missing_explanation_ids[:25],
        },
        {
            "key": "missing_must_know_topic",
            "label": "ข้อสอบจริงที่ยังไม่ผูก Must-Know Topic",
            "severity": "warning" if missing_must_know_ids else "pass",
            "count": len(missing_must_know_ids),
            "sample_ids": missing_must_know_ids[:25],
        },
        {
            "key": "invalid_image_path",
            "label": (
                "รูปภาพข้อสอบไม่พบไฟล์หรือ path ผิดรูปแบบ"
                if fs_root is not None
                else "รูปแบบ image_path ผิดพลาด (CDN syntax-only)"
            ),
            "severity": "warning" if invalid_image_path_ids else "pass",
            "count": len(invalid_image_path_ids),
            "sample_ids": invalid_image_path_ids[:25],
        },
    ]

    # Feature adoption & SM-2 health
    bookmarks_total, bookmarks_users = (
        db.query(func.count(models.Bookmark.id), func.count(func.distinct(models.Bookmark.user_id))).one()
    )
    qnotes_total, qnotes_users = (
        db.query(func.count(models.UserNote.id), func.count(func.distinct(models.UserNote.user_id))).one()
    )
    tnotes_total, tnotes_users = (
        db.query(func.count(models.UserTopicNote.id), func.count(func.distinct(models.UserTopicNote.user_id))).one()
    )
    cards_total, cards_users = (
        db.query(
            func.count(models.UserCardReview.id),
            func.count(func.distinct(models.UserCardReview.user_id)),
        ).one()
    )
    card_types = {
        ctype: int(cnt or 0)
        for ctype, cnt in db.query(models.UserCardReview.card_type, func.count(models.UserCardReview.id))
        .group_by(models.UserCardReview.card_type)
        .all()
    }

    total_answers = db.query(func.count(models.UserAnswer.id)).scalar() or 0
    confidence_tagged = (
        db.query(func.count(models.UserAnswer.id))
        .filter(
            models.UserAnswer.confidence.isnot(None),
            func.trim(models.UserAnswer.confidence) != "",
        )
        .scalar()
        or 0
    )

    sm2_total, sm2_users, sm2_overdue, sm2_lapsed, sm2_avg_ease = (
        db.query(
            func.count(models.UserQuestionStat.id),
            func.count(func.distinct(models.UserQuestionStat.user_id)),
            func.sum(case((models.UserQuestionStat.next_review_date <= now_ts, 1), else_=0)),
            func.sum(case((models.UserQuestionStat.lapse_count > 0, 1), else_=0)),
            func.avg(models.UserQuestionStat.ease_factor),
        ).one()
    )
    sm2_total = int(sm2_total or 0)
    sm2_overdue = int(sm2_overdue or 0)
    sm2_lapsed = int(sm2_lapsed or 0)

    return {
        "generated_at": now_ts,
        "bank_summary": {
            "total_questions": len(q_rows),
            "real_exam_count": real_exam_total,
            "questions_with_images": questions_with_images,
            "image_fs_checked": fs_root is not None,
            "by_exam_origin": [
                {"origin": k, "count": v, "pct": _pct(v, len(q_rows)) or 0.0}
                for k, v in sorted(origin_counts.items(), key=lambda kv: (-kv[1], kv[0]))
            ],
            "by_cognitive_level": [
                {"level": k, "count": v, "pct": _pct(v, len(q_rows)) or 0.0}
                for k, v in sorted(cognitive_counts.items(), key=lambda kv: (-kv[1], kv[0]))
            ],
        },
        "tos_coverage": tos_coverage,
        "integrity_checks": integrity_checks,
        "feature_adoption": {
            "bookmarks": {"total": int(bookmarks_total or 0), "distinct_users": int(bookmarks_users or 0)},
            "user_notes": {"total": int(qnotes_total or 0), "distinct_users": int(qnotes_users or 0)},
            "user_topic_notes": {"total": int(tnotes_total or 0), "distinct_users": int(tnotes_users or 0)},
            "user_card_reviews": {
                "total": int(cards_total or 0),
                "distinct_users": int(cards_users or 0),
                "by_type": {
                    "flashcard": card_types.get("flashcard", 0),
                    "topic": card_types.get("topic", 0),
                    "cloze": card_types.get("cloze", 0),
                },
            },
            "confidence_tagging": {
                "tagged_answers": int(confidence_tagged),
                "total_answers": int(total_answers),
                "tagged_pct": _pct(confidence_tagged, total_answers) or 0.0,
            },
            "sm2_health": {
                "total_tracked": sm2_total,
                "distinct_users": int(sm2_users or 0),
                "overdue_count": sm2_overdue,
                "overdue_pct": _pct(sm2_overdue, sm2_total) or 0.0,
                "lapsed_count": sm2_lapsed,
                "avg_ease_factor": round(float(sm2_avg_ease) / 100.0, 2) if sm2_avg_ease is not None else None,
            },
        },
    }


# ── 5. AI Tutor Telemetry & Cost Analytics (Phase 2) ──

@router.get("/ai-tutor")
def get_admin_ai_tutor_analytics(
    days: int = Query(30, ge=7, le=365),
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Monitor AI Tutor usage, LLM vs fallback rate, p50/p95 latency, tokens, and demand."""
    now_ts = int(time.time())
    now_bkk = datetime.fromtimestamp(now_ts, tz=TZ_BKK)
    start_bkk = (now_bkk - timedelta(days=days - 1)).replace(hour=0, minute=0, second=0, microsecond=0)
    cutoff_ts = int(start_bkk.timestamp())

    logs = (
        db.query(models.AiTutorLog)
        .filter(models.AiTutorLog.created_at >= cutoff_ts)
        .order_by(models.AiTutorLog.created_at.desc())
        .all()
    )

    user_ids = {row.user_id for row in logs if row.user_id is not None}
    q_ids = {row.question_id for row in logs if row.question_id is not None}

    username_map = (
        {
            uid: uname
            for uid, uname in db.query(models.User.id, models.User.username)
            .filter(models.User.id.in_(user_ids))
            .all()
        }
        if user_ids
        else {}
    )
    q_meta_map = (
        {
            qid: {"category": cat, "preview": (txt or "").strip()[:140], "source_exam": src}
            for qid, cat, txt, src in db.query(
                models.Question.id,
                models.Question.category,
                models.Question.question_text,
                models.Question.source_exam,
            )
            .filter(models.Question.id.in_(q_ids))
            .all()
        }
        if q_ids
        else {}
    )

    total_requests = len(logs)
    llm_count = 0
    fallback_count = 0
    error_count = 0
    total_tokens = 0
    prompt_tokens = 0
    completion_tokens = 0
    latencies: List[int] = []
    llm_latencies: List[int] = []

    daily_total: Dict[str, int] = defaultdict(int)
    daily_llm: Dict[str, int] = defaultdict(int)
    daily_fallback: Dict[str, int] = defaultdict(int)
    daily_tokens: Dict[str, int] = defaultdict(int)

    by_model: Dict[str, int] = defaultdict(int)
    by_status: Dict[str, int] = defaultdict(int)
    by_tag: Dict[str, int] = defaultdict(int)
    by_category: Dict[str, int] = defaultdict(int)
    q_counts: Dict[int, int] = defaultdict(int)
    topic_counts: Dict[str, int] = defaultdict(int)
    user_req_counts: Dict[int, int] = defaultdict(int)
    user_token_counts: Dict[int, int] = defaultdict(int)

    for row in logs:
        day_str = _bkk_date_str(row.created_at)
        daily_total[day_str] += 1
        if row.mode == "llm":
            llm_count += 1
            daily_llm[day_str] += 1
            if row.latency_ms is not None:
                llm_latencies.append(int(row.latency_ms))
        else:
            fallback_count += 1
            daily_fallback[day_str] += 1
        if row.status == "fallback_error":
            error_count += 1

        if row.latency_ms is not None:
            latencies.append(int(row.latency_ms))

        pt = int(row.prompt_tokens or 0)
        ct = int(row.completion_tokens or 0)
        tt = int(row.total_tokens or (pt + ct))
        prompt_tokens += pt
        completion_tokens += ct
        total_tokens += tt
        daily_tokens[day_str] += tt

        by_model[row.model_used or "unknown"] += 1
        by_status[row.status or "unknown"] += 1
        if row.suggested_tag:
            by_tag[row.suggested_tag] += 1
        if row.category:
            by_category[row.category] += 1
        if row.question_id:
            q_counts[row.question_id] += 1
        if row.topic_id:
            topic_counts[row.topic_id] += 1
        if row.user_id:
            user_req_counts[row.user_id] += 1
            user_token_counts[row.user_id] += tt

    daily_series = []
    for offset in range(days):
        day_str = (start_bkk + timedelta(days=offset)).strftime("%Y-%m-%d")
        daily_series.append(
            {
                "date": day_str,
                "total": daily_total.get(day_str, 0),
                "llm": daily_llm.get(day_str, 0),
                "fallback": daily_fallback.get(day_str, 0),
                "tokens": daily_tokens.get(day_str, 0),
            }
        )

    top_questions = [
        {
            "question_id": qid,
            "ask_count": cnt,
            "category": q_meta_map.get(qid, {}).get("category"),
            "source_exam": q_meta_map.get(qid, {}).get("source_exam"),
            "question_preview": q_meta_map.get(qid, {}).get("preview") or "",
        }
        for qid, cnt in sorted(q_counts.items(), key=lambda kv: (-kv[1], kv[0]))[:15]
    ]
    top_topics = [
        {"topic_id": tid, "ask_count": cnt}
        for tid, cnt in sorted(topic_counts.items(), key=lambda kv: (-kv[1], kv[0]))[:15]
    ]
    top_users = [
        {
            "user_id": uid,
            "username": username_map.get(uid, f"user#{uid}"),
            "requests": cnt,
            "total_tokens": user_token_counts.get(uid, 0),
        }
        for uid, cnt in sorted(user_req_counts.items(), key=lambda kv: (-kv[1], kv[0]))[:10]
    ]

    recent_logs = [
        {
            "id": row.id,
            "user_id": row.user_id,
            "username": username_map.get(row.user_id) if row.user_id else None,
            "question_id": row.question_id,
            "topic_id": row.topic_id,
            "category": row.category,
            "mode": row.mode,
            "model_used": row.model_used,
            "suggested_tag": row.suggested_tag,
            "total_tokens": row.total_tokens,
            "latency_ms": row.latency_ms,
            "status": row.status,
            "error_code": row.error_code,
            "created_at": row.created_at,
        }
        for row in logs[:30]
    ]

    return {
        "days": days,
        "generated_at": now_ts,
        "kpis": {
            "total_requests": total_requests,
            "distinct_users": len(user_req_counts),
            "llm_count": llm_count,
            "fallback_count": fallback_count,
            "llm_rate_pct": _pct(llm_count, total_requests) or 0.0,
            "fallback_rate_pct": _pct(fallback_count, total_requests) or 0.0,
            "error_count": error_count,
            "p50_latency_ms": _percentile(latencies, 0.50),
            "p95_latency_ms": _percentile(latencies, 0.95),
            "llm_p50_latency_ms": _percentile(llm_latencies, 0.50),
            "total_tokens": total_tokens,
            "prompt_tokens": prompt_tokens,
            "completion_tokens": completion_tokens,
            "avg_tokens_per_llm_call": round(total_tokens / llm_count, 1) if llm_count else None,
        },
        "daily_series": daily_series,
        "by_model": [
            {"model": m, "count": c, "pct": _pct(c, total_requests) or 0.0}
            for m, c in sorted(by_model.items(), key=lambda kv: (-kv[1], kv[0]))
        ],
        "by_status": [
            {"status": s, "count": c, "pct": _pct(c, total_requests) or 0.0}
            for s, c in sorted(by_status.items(), key=lambda kv: (-kv[1], kv[0]))
        ],
        "by_tag": [
            {"tag": t, "count": c, "pct": _pct(c, total_requests) or 0.0}
            for t, c in sorted(by_tag.items(), key=lambda kv: (-kv[1], kv[0]))
        ],
        "by_category": [
            {"category": cat, "count": c, "pct": _pct(c, total_requests) or 0.0}
            for cat, c in sorted(by_category.items(), key=lambda kv: (-kv[1], kv[0]))
        ],
        "top_questions": top_questions,
        "top_topics": top_topics,
        "top_users": top_users,
        "recent_logs": recent_logs,
    }


# ── 6. Auth Security Events & Suspicious IP Monitor (Phase 2) ──

@router.get("/security")
def get_admin_security_overview(
    days: int = Query(30, ge=1, le=365),
    event_type: Optional[str] = Query(None, max_length=48),
    success: Optional[str] = Query(None, pattern="^(all|ok|fail)$"),
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Authentication telemetry, login failure rates, rate-limit trips, and suspicious IP alerts."""
    now_ts = int(time.time())
    now_bkk = datetime.fromtimestamp(now_ts, tz=TZ_BKK)
    start_bkk = (now_bkk - timedelta(days=days - 1)).replace(hour=0, minute=0, second=0, microsecond=0)
    cutoff_ts = int(start_bkk.timestamp())

    events = (
        db.query(models.AuthEvent)
        .filter(models.AuthEvent.created_at >= cutoff_ts)
        .order_by(models.AuthEvent.created_at.desc())
        .all()
    )

    user_ids = {e.user_id for e in events if e.user_id is not None}
    username_map = (
        {
            uid: uname
            for uid, uname in db.query(models.User.id, models.User.username)
            .filter(models.User.id.in_(user_ids))
            .all()
        }
        if user_ids
        else {}
    )

    login_success = 0
    login_fail = 0
    register_count = 0
    two_fa_events = 0
    password_changes = 0
    rate_limited_count = 0

    daily_ok: Dict[str, int] = defaultdict(int)
    daily_fail: Dict[str, int] = defaultdict(int)
    daily_reg: Dict[str, int] = defaultdict(int)
    by_event_type: Dict[str, int] = defaultdict(int)

    ip_stats: Dict[str, Dict[str, Any]] = {}

    for ev in events:
        et = ev.event_type or "unknown"
        by_event_type[et] += 1
        day_str = _bkk_date_str(ev.created_at)

        if et in ("login_success", "login_2fa_success"):
            login_success += 1
            daily_ok[day_str] += 1
        elif et in ("login_fail", "login_2fa_fail"):
            login_fail += 1
            daily_fail[day_str] += 1
        elif et == "register":
            register_count += 1
            daily_reg[day_str] += 1
        elif et in ("2fa_enable", "2fa_disable", "login_2fa_challenge", "2fa_backup_regen"):
            two_fa_events += 1
        elif et == "password_change":
            password_changes += 1
        elif et == "rate_limited":
            rate_limited_count += 1

        if ev.ip_address:
            st = ip_stats.setdefault(
                ev.ip_address,
                {"ip_address": ev.ip_address, "fail_count": 0, "success_count": 0, "targets": set(), "last_seen_at": 0},
            )
            if ev.success:
                st["success_count"] += 1
            else:
                st["fail_count"] += 1
            if ev.identifier_masked:
                st["targets"].add(ev.identifier_masked)
            if ev.created_at > st["last_seen_at"]:
                st["last_seen_at"] = ev.created_at

    suspicious_ips = []
    for st in ip_stats.values():
        if st["fail_count"] >= 3:
            suspicious_ips.append(
                {
                    "ip_address": st["ip_address"],
                    "fail_count": st["fail_count"],
                    "success_count": st["success_count"],
                    "distinct_targets": len(st["targets"]),
                    "severity": "high" if st["fail_count"] >= 5 else "watch",
                    "last_seen_at": st["last_seen_at"],
                }
            )
    suspicious_ips.sort(key=lambda r: (-r["fail_count"], -r["last_seen_at"]))

    daily_series = []
    for offset in range(days):
        day_str = (start_bkk + timedelta(days=offset)).strftime("%Y-%m-%d")
        daily_series.append(
            {
                "date": day_str,
                "login_success": daily_ok.get(day_str, 0),
                "login_fail": daily_fail.get(day_str, 0),
                "register": daily_reg.get(day_str, 0),
            }
        )

    filtered_events = []
    for ev in events:
        if event_type and event_type != "all" and ev.event_type != event_type:
            continue
        if success == "ok" and not ev.success:
            continue
        if success == "fail" and ev.success:
            continue
        filtered_events.append(
            {
                "id": ev.id,
                "user_id": ev.user_id,
                "username": username_map.get(ev.user_id) if ev.user_id else None,
                "identifier_masked": ev.identifier_masked,
                "event_type": ev.event_type,
                "success": bool(ev.success),
                "ip_address": ev.ip_address,
                "user_agent": ev.user_agent,
                "detail": ev.detail,
                "created_at": ev.created_at,
            }
        )
        if len(filtered_events) >= 60:
            break

    total_login_attempts = login_success + login_fail
    return {
        "days": days,
        "generated_at": now_ts,
        "kpis": {
            "total_events": len(events),
            "login_success": login_success,
            "login_fail": login_fail,
            "login_fail_rate_pct": _pct(login_fail, total_login_attempts) or 0.0,
            "register_count": register_count,
            "two_fa_events": two_fa_events,
            "password_changes": password_changes,
            "rate_limited_count": rate_limited_count,
            "suspicious_ips_count": sum(1 for r in suspicious_ips if r["severity"] == "high"),
        },
        "daily_series": daily_series,
        "by_event_type": [
            {"event_type": et, "count": cnt}
            for et, cnt in sorted(by_event_type.items(), key=lambda kv: (-kv[1], kv[0]))
        ],
        "suspicious_ips": suspicious_ips[:20],
        "recent_events": filtered_events,
    }


# ── 7. Admin Audit Trail & CSV Export (Phase 2) ──

def _query_audit_logs(
    db: Session,
    *,
    days: int,
    action: Optional[str] = None,
) -> Dict[str, Any]:
    cutoff_ts = int(time.time()) - (days * 86400)
    rows = (
        db.query(models.AdminAuditLog)
        .filter(models.AdminAuditLog.created_at >= cutoff_ts)
        .order_by(models.AdminAuditLog.created_at.desc())
        .all()
    )
    admin_ids = {r.admin_id for r in rows if r.admin_id is not None}
    admin_map = (
        {
            uid: uname
            for uid, uname in db.query(models.User.id, models.User.username)
            .filter(models.User.id.in_(admin_ids))
            .all()
        }
        if admin_ids
        else {}
    )

    by_action: Dict[str, int] = defaultdict(int)
    items: List[Dict[str, Any]] = []
    for r in rows:
        by_action[r.action] += 1
        if action and action != "all" and r.action != action:
            continue
        parsed_details: Any = None
        if r.details_json:
            try:
                parsed_details = json.loads(r.details_json)
            except Exception:
                parsed_details = r.details_json
        items.append(
            {
                "id": r.id,
                "admin_id": r.admin_id,
                "admin_username": admin_map.get(r.admin_id, f"admin#{r.admin_id}" if r.admin_id else "system"),
                "action": r.action,
                "target_type": r.target_type,
                "target_id": r.target_id,
                "details": parsed_details,
                "ip_address": r.ip_address,
                "created_at": r.created_at,
            }
        )
    return {
        "items": items,
        "by_action": [
            {"action": a, "count": c}
            for a, c in sorted(by_action.items(), key=lambda kv: (-kv[1], kv[0]))
        ],
    }


@router.get("/audit-logs")
def get_admin_audit_logs(
    days: int = Query(90, ge=1, le=3650),
    action: Optional[str] = Query(None, max_length=64),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """List immutable admin action audit trail."""
    built = _query_audit_logs(db, days=days, action=action)
    items = built["items"]
    return {
        "total_matched": len(items),
        "by_action": built["by_action"],
        "limit": limit,
        "offset": offset,
        "items": items[offset : offset + limit],
    }


@router.get("/audit-logs/export")
def export_admin_audit_logs_csv(
    days: int = Query(90, ge=1, le=3650),
    action: Optional[str] = Query(None, max_length=64),
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Export admin audit trail as UTF-8 BOM CSV with formula-injection protection."""
    built = _query_audit_logs(db, days=days, action=action)
    output = io.StringIO()
    output.write("\ufeff")
    writer = csv.writer(output)
    writer.writerow(["id", "timestamp_bkk", "admin_username", "action", "target_type", "target_id", "ip_address", "details_json"])
    for item in built["items"]:
        details_str = json.dumps(item["details"], ensure_ascii=False) if item["details"] is not None else ""
        writer.writerow([
            item["id"],
            _format_bkk_iso(item["created_at"]),
            _sanitize_csv_cell(item["admin_username"]),
            _sanitize_csv_cell(item["action"]),
            _sanitize_csv_cell(item["target_type"]),
            _sanitize_csv_cell(item["target_id"] or ""),
            _sanitize_csv_cell(item["ip_address"] or ""),
            _sanitize_csv_cell(details_str),
        ])
    today_str = datetime.fromtimestamp(int(time.time()), tz=TZ_BKK).strftime("%Y-%m-%d")
    return Response(
        content=output.getvalue(),
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": f"attachment; filename=admin_audit_logs_{today_str}.csv"},
    )


# ── 8. Safe Inline Question Quick-Edit & Obsidian/Repo Sync Queue (Phase 2) ──

@router.patch("/questions/{question_id}")
def admin_quick_edit_question(
    question_id: int,
    payload: AdminQuestionQuickEdit,
    request: Request,
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Safely edit question key/category/topic/text/explanation with validation, diff history & sync queue."""
    question = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="ไม่พบข้อสอบที่ระบุ")

    choice_labels = {
        (c.label or "").strip().upper()
        for c in db.query(models.Choice).filter(models.Choice.question_id == question_id).all()
        if c.label
    }

    changes: Dict[str, Dict[str, Any]] = {}

    if payload.correct_answer is not None:
        clean_ans = payload.correct_answer.strip().upper()
        if choice_labels and clean_ans not in choice_labels:
            raise HTTPException(
                status_code=400,
                detail=f"เฉลย '{clean_ans}' ไม่ตรงกับตัวเลือกที่มี ({sorted(choice_labels)})",
            )
        if (question.correct_answer or "").strip().upper() != clean_ans:
            changes["correct_answer"] = {"before": question.correct_answer, "after": clean_ans}
            question.correct_answer = clean_ans

    if payload.category is not None:
        clean_cat = payload.category.strip()
        if clean_cat not in VALID_CATEGORIES:
            raise HTTPException(status_code=400, detail="ชื่อสาขาวิชาไม่ตรงกับเกณฑ์ 11 สาขา")
        if question.category != clean_cat:
            changes["category"] = {"before": question.category, "after": clean_cat}
            question.category = clean_cat

    if payload.must_know_topic is not None:
        clean_topic = payload.must_know_topic.strip() or None
        if question.must_know_topic != clean_topic:
            changes["must_know_topic"] = {"before": question.must_know_topic, "after": clean_topic}
            question.must_know_topic = clean_topic

    if payload.question_text is not None:
        clean_qtext = payload.question_text.strip()
        if question.question_text != clean_qtext:
            changes["question_text"] = {"before": question.question_text, "after": clean_qtext}
            question.question_text = clean_qtext

    if payload.explanation is not None:
        clean_expl = payload.explanation.strip()
        if clean_expl.startswith("{"):
            try:
                parsed = json.loads(clean_expl)
                if not isinstance(parsed, dict):
                    raise ValueError("JSON root must be an object")
            except Exception as exc:
                raise HTTPException(status_code=400, detail=f"รูปแบบ JSON คำอธิบายไม่ถูกต้อง: {exc}")
        if (question.explanation or "") != clean_expl:
            changes["explanation"] = {
                "before": (question.explanation or "")[:300],
                "after": clean_expl[:300],
                "full_after_len": len(clean_expl),
            }
            question.explanation = clean_expl

    if not changes:
        raise HTTPException(status_code=400, detail="ไม่มีข้อมูลที่เปลี่ยนแปลง")

    now_ts = int(time.time())
    edit_log = models.QuestionEditLog(
        question_id=question.id,
        admin_id=admin.id,
        report_id=payload.report_id,
        field_changes_json=json.dumps(changes, ensure_ascii=False),
        edit_reason=payload.edit_reason.strip(),
        sync_status="pending_sync",
        created_at=now_ts,
    )
    db.add(question)
    db.add(edit_log)

    resolved_report_id = None
    if payload.report_id and payload.resolve_report:
        rep = db.query(models.ReportedQuestion).filter(models.ReportedQuestion.id == payload.report_id).first()
        if rep and rep.question_id == question.id:
            rep.status = "resolved"
            if payload.admin_reply is not None:
                rep.admin_reply = payload.admin_reply.strip()
            elif not rep.admin_reply:
                rep.admin_reply = "ตรวจสอบและปรับปรุงข้อสอบเรียบร้อยแล้ว ขอบคุณที่ช่วยแจ้งครับ"
            db.add(rep)
            resolved_report_id = rep.id

    db.commit()
    db.refresh(edit_log)

    record_admin_audit(
        db,
        admin_id=admin.id,
        action="admin_question_edit",
        target_type="question",
        target_id=question.id,
        details={
            "edit_log_id": edit_log.id,
            "report_id": resolved_report_id or payload.report_id,
            "edit_reason": edit_log.edit_reason,
            "fields": sorted(changes.keys()),
            "changes": changes,
        },
        request=request,
    )

    return {
        "question_id": question.id,
        "edit_log_id": edit_log.id,
        "sync_status": edit_log.sync_status,
        "updated_fields": sorted(changes.keys()),
        "resolved_report_id": resolved_report_id,
    }


@router.get("/question-edits")
def list_admin_question_edits(
    sync_status: Optional[str] = Query(None, pattern="^(all|pending_sync|synced)$"),
    limit: int = Query(100, ge=1, le=500),
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """List admin inline question edits & Obsidian/SQLite sync queue status."""
    pending_count = (
        db.query(func.count(models.QuestionEditLog.id))
        .filter(models.QuestionEditLog.sync_status == "pending_sync")
        .scalar()
        or 0
    )
    synced_count = (
        db.query(func.count(models.QuestionEditLog.id))
        .filter(models.QuestionEditLog.sync_status == "synced")
        .scalar()
        or 0
    )

    q = db.query(models.QuestionEditLog)
    if sync_status and sync_status != "all":
        q = q.filter(models.QuestionEditLog.sync_status == sync_status)
    rows = q.order_by(models.QuestionEditLog.created_at.desc()).limit(limit).all()

    admin_ids = {r.admin_id for r in rows if r.admin_id is not None}
    q_ids = {r.question_id for r in rows}
    admin_map = (
        {u_id: uname for u_id, uname in db.query(models.User.id, models.User.username).filter(models.User.id.in_(admin_ids)).all()}
        if admin_ids
        else {}
    )
    q_map = (
        {
            qid: {"category": cat, "source_exam": src, "correct_answer": ans}
            for qid, cat, src, ans in db.query(
                models.Question.id, models.Question.category, models.Question.source_exam, models.Question.correct_answer
            )
            .filter(models.Question.id.in_(q_ids))
            .all()
        }
        if q_ids
        else {}
    )

    items = []
    for r in rows:
        try:
            changes = json.loads(r.field_changes_json)
        except Exception:
            changes = {}
        qm = q_map.get(r.question_id, {})
        items.append(
            {
                "id": r.id,
                "question_id": r.question_id,
                "report_id": r.report_id,
                "admin_id": r.admin_id,
                "admin_username": admin_map.get(r.admin_id, f"admin#{r.admin_id}" if r.admin_id else "system"),
                "category": qm.get("category"),
                "source_exam": qm.get("source_exam"),
                "current_correct_answer": qm.get("correct_answer"),
                "field_changes": changes,
                "edit_reason": r.edit_reason,
                "sync_status": r.sync_status,
                "created_at": r.created_at,
                "synced_at": r.synced_at,
            }
        )

    return {
        "counts": {
            "pending_sync": int(pending_count),
            "synced": int(synced_count),
            "total": int(pending_count + synced_count),
        },
        "items": items,
    }


@router.get("/question-edits/export-sync")
def export_question_edits_sync_bundle(
    request: Request,
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Download a JSON patch bundle of pending_sync question edits for Obsidian/local DB reconciliation."""
    rows = (
        db.query(models.QuestionEditLog)
        .filter(models.QuestionEditLog.sync_status == "pending_sync")
        .order_by(models.QuestionEditLog.created_at.asc())
        .all()
    )
    q_ids = list({r.question_id for r in rows})
    q_current = (
        {
            q.id: {
                "question_id": q.id,
                "category": q.category,
                "source_exam": q.source_exam,
                "exam_origin": q.exam_origin,
                "correct_answer": q.correct_answer,
                "must_know_topic": q.must_know_topic,
                "question_text": q.question_text,
                "explanation": q.explanation,
            }
            for q in db.query(models.Question).filter(models.Question.id.in_(q_ids)).all()
        }
        if q_ids
        else {}
    )

    bundle = {
        "exported_at_bkk": _format_bkk_iso(int(time.time())),
        "db_backend": _db_backend_label(db),
        "pending_edit_ids": [r.id for r in rows],
        "affected_question_count": len(q_current),
        "questions_latest_state": list(q_current.values()),
        "edit_log": [
            {
                "edit_id": r.id,
                "question_id": r.question_id,
                "report_id": r.report_id,
                "edit_reason": r.edit_reason,
                "created_at_bkk": _format_bkk_iso(r.created_at),
                "field_changes": json.loads(r.field_changes_json) if r.field_changes_json else {},
            }
            for r in rows
        ],
    }

    record_admin_audit(
        db,
        admin_id=admin.id,
        action="admin_question_sync_export",
        target_type="question_sync_bundle",
        details={"pending_count": len(rows), "question_ids": q_ids[:50]},
        request=request,
    )

    today_str = datetime.fromtimestamp(int(time.time()), tz=TZ_BKK).strftime("%Y-%m-%d")
    return Response(
        content=json.dumps(bundle, ensure_ascii=False, indent=2),
        media_type="application/json; charset=utf-8",
        headers={"Content-Disposition": f"attachment; filename=question_sync_patch_{today_str}.json"},
    )


@router.post("/question-edits/mark-synced")
def mark_question_edits_synced(
    payload: MarkSyncedRequest,
    request: Request,
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Mark pending_sync question edits as synced after reconciling with Obsidian/offline repo."""
    q = db.query(models.QuestionEditLog).filter(models.QuestionEditLog.sync_status == "pending_sync")
    if not payload.mark_all:
        if not payload.edit_ids:
            raise HTTPException(status_code=400, detail="กรุณาระบุ edit_ids หรือตั้ง mark_all=true")
        q = q.filter(models.QuestionEditLog.id.in_(payload.edit_ids))

    rows = q.all()
    now_ts = int(time.time())
    marked_ids = []
    for r in rows:
        r.sync_status = "synced"
        r.synced_at = now_ts
        db.add(r)
        marked_ids.append(r.id)
    db.commit()

    if marked_ids:
        record_admin_audit(
            db,
            admin_id=admin.id,
            action="admin_question_sync_marked",
            target_type="question_edit_logs",
            details={"marked_count": len(marked_ids), "edit_ids": marked_ids[:50]},
            request=request,
        )

    return {"marked_count": len(marked_ids), "marked_ids": marked_ids}
