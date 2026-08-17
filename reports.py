import time
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

import models
from auth import get_current_user, get_current_admin
from database import get_db

router = APIRouter(prefix="/api/reports", tags=["reports"])

VALID_STATUSES = {"pending", "reviewing", "resolved", "rejected"}


class ReportCreate(BaseModel):
    question_id: int
    issue_type: str
    description: Optional[str] = None


class ReportResponse(BaseModel):
    id: int
    question_id: int
    user_id: int
    issue_type: str
    description: Optional[str]
    status: str
    created_at: int


class ReportStatusUpdate(BaseModel):
    status: str


@router.post("", response_model=ReportResponse)
def create_report(
    req: ReportCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Verify the question exists so bogus reports can't be filed
    question = db.query(models.Question).filter(models.Question.id == req.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    db_report = models.ReportedQuestion(
        question_id=req.question_id,
        user_id=current_user.id,
        issue_type=req.issue_type,
        description=req.description,
        created_at=int(time.time()),
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report


# ── Admin endpoints ──

@router.get("", response_model=List[dict])
def list_reports(
    status: Optional[str] = Query(None),
    limit: int = Query(100, gt=0, le=500),
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """List reported questions with question/reporter details (admin only)."""
    query = db.query(models.ReportedQuestion)
    if status:
        if status not in VALID_STATUSES:
            raise HTTPException(status_code=400, detail=f"Invalid status. Use one of {sorted(VALID_STATUSES)}")
        query = query.filter(models.ReportedQuestion.status == status)

    rows = query.order_by(models.ReportedQuestion.created_at.desc()).limit(limit).all()

    result = []
    for r in rows:
        question = db.query(models.Question).filter(models.Question.id == r.question_id).first()
        reporter = db.query(models.User).filter(models.User.id == r.user_id).first()
        result.append(
            {
                "id": r.id,
                "question_id": r.question_id,
                "issue_type": r.issue_type,
                "description": r.description,
                "status": r.status,
                "created_at": r.created_at,
                "reporter_username": reporter.username if reporter else None,
                "question_text": question.question_text if question else "(question deleted)",
                "category": question.category if question else None,
                "source_exam": question.source_exam if question else None,
                "correct_answer": question.correct_answer if question else None,
            }
        )
    return result


@router.patch("/{report_id}", response_model=ReportResponse)
def update_report_status(
    report_id: int,
    req: ReportStatusUpdate,
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Update a report's status (admin only)."""
    if req.status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status. Use one of {sorted(VALID_STATUSES)}")

    report = db.query(models.ReportedQuestion).filter(models.ReportedQuestion.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report.status = req.status
    db.commit()
    db.refresh(report)
    return report