import json
import time
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from pydantic import BaseModel, Field
from sqlalchemy import case, func
from sqlalchemy.orm import Session, joinedload, selectinload

import models
from auth import get_current_user, get_current_admin, _check_rate_limit, _get_client_ip
from database import get_db
from observability import record_admin_audit
from tos_blueprint import is_mock_70_locked

router = APIRouter(prefix="/api/reports", tags=["reports"])

VALID_STATUSES = {"pending", "reviewing", "resolved", "rejected"}


def _extract_explanation_preview(raw: Optional[str], max_len: int = 320) -> Optional[str]:
    """Return a clean human-readable snippet from plain-text or JSON structured explanations."""
    if not raw or not raw.strip():
        return None
    stripped = raw.strip()
    if stripped.startswith("{"):
        try:
            data = json.loads(stripped)
            if isinstance(data, dict):
                for key in ("correct_reason", "summary", "takeaway", "key_takeaway", "explanation"):
                    val = data.get(key)
                    if isinstance(val, str) and val.strip():
                        text_out = val.strip()
                        return text_out[:max_len] + ("…" if len(text_out) > max_len else "")
        except Exception:
            pass
    return stripped[:max_len] + ("…" if len(stripped) > max_len else "")


class ReportCreate(BaseModel):
    question_id: int
    issue_type: str = Field(..., min_length=1, max_length=64)
    description: Optional[str] = Field(default=None, max_length=2000)


class ReportResponse(BaseModel):
    id: int
    question_id: int
    user_id: int
    issue_type: str
    description: Optional[str]
    status: str
    admin_reply: Optional[str] = None
    created_at: int


class ReportStatusUpdate(BaseModel):
    status: str = Field(..., min_length=1, max_length=32)
    admin_reply: Optional[str] = Field(default=None, max_length=2000)


@router.post("", response_model=ReportResponse)
def create_report(
    req: ReportCreate,
    request: Request,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _check_rate_limit(f"report:u:{current_user.id}", max_attempts=15, window_seconds=300)
    _check_rate_limit(f"report:ip:{_get_client_ip(request)}", max_attempts=30, window_seconds=300)

    # Verify the question exists so bogus reports can't be filed
    question = db.query(models.Question).filter(models.Question.id == req.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    if is_mock_70_locked() and question.source_exam and "2570" in question.source_exam:
        raise HTTPException(status_code=403, detail="Mock 2570 exam question is locked")

    issue_type_clean = req.issue_type.strip()
    if not issue_type_clean:
        raise HTTPException(status_code=422, detail="issue_type cannot be empty")

    db_report = models.ReportedQuestion(
        question_id=req.question_id,
        user_id=current_user.id,
        issue_type=issue_type_clean,
        description=req.description,
        created_at=int(time.time()),
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report


# ── Admin endpoints ──

@router.get("/summary")
def get_reports_summary(
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Aggregate report triage counts, repeat-reported questions, and oldest open SLA age."""
    now_ts = int(time.time())
    status_rows = (
        db.query(models.ReportedQuestion.status, func.count(models.ReportedQuestion.id))
        .group_by(models.ReportedQuestion.status)
        .all()
    )
    counts = {st: 0 for st in VALID_STATUSES}
    for st, cnt in status_rows:
        if st in counts:
            counts[st] = int(cnt or 0)
    counts["total"] = sum(counts.values())
    counts["open"] = counts["pending"] + counts["reviewing"]

    repeat_rows = (
        db.query(models.ReportedQuestion.question_id)
        .group_by(models.ReportedQuestion.question_id)
        .having(func.count(models.ReportedQuestion.id) > 1)
        .all()
    )
    oldest_open_ts = (
        db.query(func.min(models.ReportedQuestion.created_at))
        .filter(models.ReportedQuestion.status.in_(["pending", "reviewing"]))
        .scalar()
    )
    oldest_open_age_days = (
        max(0, int((now_ts - int(oldest_open_ts)) // 86400))
        if oldest_open_ts is not None
        else None
    )

    return {
        "counts": counts,
        "repeat_questions_count": len(repeat_rows),
        "oldest_open_age_days": oldest_open_age_days,
    }


@router.get("", response_model=List[dict])
def list_reports(
    status: Optional[str] = Query(None),
    limit: int = Query(100, gt=0, le=500),
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """List reported questions with full question/choices/reporter context via eager loading (admin only)."""
    now_ts = int(time.time())
    query = (
        db.query(models.ReportedQuestion)
        .options(
            joinedload(models.ReportedQuestion.user),
            joinedload(models.ReportedQuestion.question).selectinload(models.Question.choices),
        )
    )
    if status:
        if status not in VALID_STATUSES:
            raise HTTPException(status_code=400, detail=f"Invalid status. Use one of {sorted(VALID_STATUSES)}")
        query = query.filter(models.ReportedQuestion.status == status)

    rows = query.order_by(models.ReportedQuestion.created_at.desc()).limit(limit).all()

    q_ids = list({r.question_id for r in rows})
    repeat_map = {}
    if q_ids:
        agg_rows = (
            db.query(
                models.ReportedQuestion.question_id,
                func.count(models.ReportedQuestion.id),
                func.sum(
                    case(
                        (models.ReportedQuestion.status.in_(["pending", "reviewing"]), 1),
                        else_=0,
                    )
                ),
            )
            .filter(models.ReportedQuestion.question_id.in_(q_ids))
            .group_by(models.ReportedQuestion.question_id)
            .all()
        )
        repeat_map = {
            qid: (int(total or 0), int(open_cnt or 0))
            for qid, total, open_cnt in agg_rows
        }

    result = []
    for r in rows:
        question = r.question
        reporter = r.user
        total_on_q, open_on_q = repeat_map.get(r.question_id, (1, 1 if r.status in ("pending", "reviewing") else 0))
        sorted_choices = (
            sorted(
                [{"label": c.label, "text": c.text} for c in (question.choices or [])],
                key=lambda c: (c["label"] or "").upper(),
            )
            if question
            else []
        )
        age_days = max(0, int((now_ts - int(r.created_at)) // 86400)) if r.created_at else 0
        result.append(
            {
                "id": r.id,
                "question_id": r.question_id,
                "issue_type": r.issue_type,
                "description": r.description,
                "status": r.status,
                "admin_reply": r.admin_reply,
                "created_at": r.created_at,
                "age_days": age_days,
                "total_reports_on_question": total_on_q,
                "open_reports_on_question": open_on_q,
                "reporter_username": reporter.username if reporter else None,
                "question_text": question.question_text if question else "(question deleted)",
                "category": question.category if question else None,
                "source_exam": question.source_exam if question else None,
                "exam_origin": question.exam_origin if question else None,
                "must_know_topic": question.must_know_topic if question else None,
                "correct_answer": question.correct_answer if question else None,
                "choices": sorted_choices,
                "explanation_preview": _extract_explanation_preview(question.explanation) if question else None,
            }
        )
    return result


@router.patch("/{report_id}", response_model=ReportResponse)
def update_report_status(
    report_id: int,
    req: ReportStatusUpdate,
    request: Request,
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Update a report's status and reply (admin only)."""
    if req.status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status. Use one of {sorted(VALID_STATUSES)}")

    report = db.query(models.ReportedQuestion).filter(models.ReportedQuestion.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    old_status = report.status
    report.status = req.status
    if req.admin_reply is not None:
        report.admin_reply = req.admin_reply
    db.commit()
    db.refresh(report)

    record_admin_audit(
        db,
        admin_id=admin.id,
        action="admin_report_update",
        target_type="reported_question",
        target_id=report.id,
        details={
            "question_id": report.question_id,
            "old_status": old_status,
            "new_status": report.status,
            "has_reply": bool(report.admin_reply and report.admin_reply.strip()),
        },
        request=request,
    )
    return report


@router.get("/my", response_model=List[dict])
def list_my_reports(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List reports created by the current user."""
    rows = (
        db.query(models.ReportedQuestion)
        .options(joinedload(models.ReportedQuestion.question))
        .filter(models.ReportedQuestion.user_id == current_user.id)
        .order_by(models.ReportedQuestion.created_at.desc())
        .all()
    )

    result = []
    for r in rows:
        question = r.question
        result.append(
            {
                "id": r.id,
                "question_id": r.question_id,
                "issue_type": r.issue_type,
                "description": r.description,
                "status": r.status,
                "admin_reply": r.admin_reply,
                "created_at": r.created_at,
                "question_text": question.question_text if question else "(question deleted)",
            }
        )
    return result