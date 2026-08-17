import time
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload

import models
import schema
from auth import get_current_user
from database import get_db

router = APIRouter(prefix="/api/bookmarks", tags=["bookmarks"])


# ── Bookmarks ──

@router.get("", response_model=List[dict])
def list_bookmarks(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List the current user's bookmarked questions (with full question data)."""
    rows = (
        db.query(models.Bookmark)
        .filter(models.Bookmark.user_id == current_user.id)
        .order_by(models.Bookmark.created_at.desc())
        .all()
    )
    if not rows:
        return []

    question_ids = [r.question_id for r in rows]
    questions = (
        db.query(models.Question)
        .options(selectinload(models.Question.choices))
        .filter(models.Question.id.in_(question_ids))
        .all()
    )
    q_map = {q.id: q for q in questions}

    result = []
    for r in rows:
        q = q_map.get(r.question_id)
        if not q:
            continue
        result.append(
            {
                "bookmark_id": r.id,
                "bookmarked_at": r.created_at,
                "id": q.id,
                "question_text": q.question_text,
                "stem": q.stem,
                "proposition": q.proposition,
                "category": q.category,
                "task": q.task,
                "correct_answer": q.correct_answer,
                "explanation": q.explanation,
                "source_exam": q.source_exam,
                "image_path": q.image_path,
                "choices": [{"label": c.label, "text": c.text} for c in q.choices],
            }
        )
    return result


@router.post("", response_model=schema.BookmarkResponse, status_code=201)
def add_bookmark(
    req: schema.BookmarkCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Bookmark a question. Idempotent — returns the existing bookmark if present."""
    question = (
        db.query(models.Question).filter(models.Question.id == req.question_id).first()
    )
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    existing = (
        db.query(models.Bookmark)
        .filter(
            models.Bookmark.user_id == current_user.id,
            models.Bookmark.question_id == req.question_id,
        )
        .first()
    )
    if existing:
        return existing

    bookmark = models.Bookmark(
        user_id=current_user.id,
        question_id=req.question_id,
        created_at=int(time.time()),
    )
    db.add(bookmark)
    db.commit()
    db.refresh(bookmark)
    return bookmark


@router.delete("/{question_id}", status_code=204)
def remove_bookmark(
    question_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Remove a bookmark by question id."""
    deleted = (
        db.query(models.Bookmark)
        .filter(
            models.Bookmark.user_id == current_user.id,
            models.Bookmark.question_id == question_id,
        )
        .delete()
    )
    db.commit()
    if not deleted:
        raise HTTPException(status_code=404, detail="Bookmark not found")
    return None


# ── Personal Notes ──

@router.get("/notes", response_model=List[schema.UserNoteResponse])
def list_notes(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all personal notes of the current user."""
    return (
        db.query(models.UserNote)
        .filter(models.UserNote.user_id == current_user.id)
        .order_by(models.UserNote.updated_at.desc())
        .all()
    )


@router.get("/notes/{question_id}", response_model=schema.UserNoteResponse)
def get_note(
    question_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the note for a specific question (404 if none)."""
    note = (
        db.query(models.UserNote)
        .filter(
            models.UserNote.user_id == current_user.id,
            models.UserNote.question_id == question_id,
        )
        .first()
    )
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


@router.put("/notes", response_model=schema.UserNoteResponse)
def upsert_note(
    req: schema.UserNoteUpsert,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create or update the personal note for a question."""
    question = (
        db.query(models.Question).filter(models.Question.id == req.question_id).first()
    )
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    now = int(time.time())
    note = (
        db.query(models.UserNote)
        .filter(
            models.UserNote.user_id == current_user.id,
            models.UserNote.question_id == req.question_id,
        )
        .first()
    )
    if note:
        note.note_text = req.note_text
        note.updated_at = now
    else:
        note = models.UserNote(
            user_id=current_user.id,
            question_id=req.question_id,
            note_text=req.note_text,
            updated_at=now,
        )
        db.add(note)
    db.commit()
    db.refresh(note)
    return note


@router.delete("/notes/{question_id}", status_code=204)
def delete_note(
    question_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete the personal note for a question."""
    deleted = (
        db.query(models.UserNote)
        .filter(
            models.UserNote.user_id == current_user.id,
            models.UserNote.question_id == question_id,
        )
        .delete()
    )
    db.commit()
    if not deleted:
        raise HTTPException(status_code=404, detail="Note not found")
    return None