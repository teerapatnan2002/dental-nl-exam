import time
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy.orm import Session, selectinload

import models
import schema
from auth import get_current_user
from database import get_db
from learning import _parse_explanation, get_topic_meta
from pathways import get_topic_pathways
from tos_blueprint import is_mock_70_locked

router = APIRouter(prefix="/api/bookmarks", tags=["bookmarks"])

MISTAKE_TAG_OPTIONS: List[str] = [
    "สับสนนิยาม",
    "ลืมตัวเลข",
    "พลาดแนวทางไทย",
    "โดนตัวลวง",
    "สรุป AI Tutor",
]


def _serialize_vault_question(
    q: models.Question,
    bm: Optional[models.Bookmark],
    note: Optional[models.UserNote],
    wrong_count: int = 0,
) -> Dict[str, Any]:
    exp = _parse_explanation(q.explanation)
    tid = (note.topic_id if note and note.topic_id else None) or q.must_know_topic or ""
    cat = q.category or ""
    meta = get_topic_meta(tid, cat) if tid else {"title_th": cat, "title_en": ""}
    correct_label = (q.correct_answer or "").strip().upper()
    correct_choice_text = ""
    choices_out = []
    for ch in q.choices or []:
        lbl = (ch.label or "").strip()
        choices_out.append({"label": lbl, "text": ch.text})
        if lbl.upper() == correct_label:
            correct_choice_text = ch.text

    return {
        "id": q.id,
        "is_bookmarked": bm is not None,
        "bookmark_id": bm.id if bm else None,
        "bookmarked_at": bm.created_at if bm else None,
        "note_id": note.id if note else None,
        "note_text": note.note_text if note else "",
        "mistake_tag": note.mistake_tag if note else None,
        "note_updated_at": note.updated_at if note else None,
        "must_know_topic": tid,
        "topic_title_th": meta.get("title_th") or cat,
        "category": cat,
        "task": q.task,
        "cognitive_level": q.cognitive_level,
        "source_exam": q.source_exam,
        "image_path": q.image_path,
        "question_text": q.question_text,
        "stem": q.stem,
        "proposition": q.proposition,
        "correct_answer": q.correct_answer,
        "correct_choice_text": correct_choice_text,
        "explanation": q.explanation,
        "core_principle": (exp.get("core_principle") or exp.get("why_correct") or "").strip(),
        "key_takeaway": (exp.get("key_takeaway") or "").strip(),
        "common_pitfall": (exp.get("common_pitfall") or "").strip(),
        "reference": (exp.get("reference") or exp.get("legal_citation") or "").strip(),
        "wrong_count": int(wrong_count or 0),
        "choices": choices_out,
    }


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


@router.get("/with-notes")
def list_bookmarks_with_notes(
    tag: Optional[str] = Query(None),
    q: Optional[str] = Query(None),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Single joined Knowledge Vault endpoint: Bookmarks + Question Notes + Topic Notes + Repeat-Wrong Triggers (zero N+1)."""
    bm_rows = (
        db.query(models.Bookmark)
        .filter(models.Bookmark.user_id == current_user.id)
        .order_by(models.Bookmark.created_at.desc())
        .all()
    )
    note_rows = (
        db.query(models.UserNote)
        .filter(models.UserNote.user_id == current_user.id)
        .order_by(models.UserNote.updated_at.desc())
        .all()
    )
    topic_note_rows = (
        db.query(models.UserTopicNote)
        .filter(models.UserTopicNote.user_id == current_user.id)
        .order_by(models.UserTopicNote.updated_at.desc())
        .all()
    )
    wrong_count_rows = (
        db.query(
            models.UserAnswer.question_id,
            func.count(models.UserAnswer.id).label("cnt"),
        )
        .join(models.ExamSession, models.ExamSession.id == models.UserAnswer.session_id)
        .filter(
            models.ExamSession.user_id == current_user.id,
            models.UserAnswer.is_correct == 0,
        )
        .group_by(models.UserAnswer.question_id)
        .order_by(func.count(models.UserAnswer.id).desc())
        .limit(40)
        .all()
    )

    bm_map = {b.question_id: b for b in bm_rows}
    note_map = {n.question_id: n for n in note_rows}
    wrong_count_map = {int(qid): int(cnt) for qid, cnt in wrong_count_rows}

    all_qids = list(
        dict.fromkeys(list(bm_map.keys()) + list(note_map.keys()) + list(wrong_count_map.keys()))
    )
    q_map: Dict[int, models.Question] = {}
    if all_qids:
        questions = (
            db.query(models.Question)
            .options(selectinload(models.Question.choices))
            .filter(models.Question.id.in_(all_qids))
            .all()
        )
        locked = is_mock_70_locked()
        for ques in questions:
            if locked and ques.source_exam and "2570" in ques.source_exam:
                continue
            q_map[ques.id] = ques

    # Bookmarked OR noted question vault items
    vault_qids: List[int] = []
    seen = set()
    for b in bm_rows:
        if b.question_id in q_map and b.question_id not in seen:
            vault_qids.append(b.question_id)
            seen.add(b.question_id)
    for n in note_rows:
        if n.question_id in q_map and n.question_id not in seen and ((n.note_text or "").strip() or n.mistake_tag):
            vault_qids.append(n.question_id)
            seen.add(n.question_id)

    all_vault_items = [
        _serialize_vault_question(q_map[qid], bm_map.get(qid), note_map.get(qid), wrong_count_map.get(qid, 0))
        for qid in vault_qids
    ]

    all_topic_notes: List[Dict[str, Any]] = []
    for tn in topic_note_rows:
        meta = get_topic_meta(tn.topic_id, "")
        title_th = meta.get("title_th") or tn.topic_id
        pws = get_topic_pathways(tn.topic_id, "", [], title_th)
        pathway_highlights: List[str] = []
        if pws:
            pw0 = pws[0]
            for st in pw0.get("steps", [])[:4]:
                pathway_highlights.append(f"{st.get('step_num')}. {st.get('title')}: {st.get('detail')}")
        all_topic_notes.append(
            {
                "id": tn.id,
                "topic_id": tn.topic_id,
                "topic_title_th": meta.get("title_th") or tn.topic_id,
                "topic_title_en": meta.get("title_en") or "",
                "mistake_tag": tn.mistake_tag,
                "note_text": tn.note_text,
                "updated_at": tn.updated_at,
                "pathway_title": pws[0].get("title") if pws else "",
                "pathway_highlights": pathway_highlights,
            }
        )

    repeat_wrong = [
        _serialize_vault_question(q_map[qid], bm_map.get(qid), note_map.get(qid), cnt)
        for qid, cnt in wrong_count_rows
        if qid in q_map
    ][:25]

    tag_counts: Dict[str, int] = {t: 0 for t in MISTAKE_TAG_OPTIONS}
    untagged_count = 0
    for it in all_vault_items:
        t = it.get("mistake_tag")
        if t:
            tag_counts[t] = tag_counts.get(t, 0) + 1
        elif (it.get("note_text") or "").strip():
            untagged_count += 1
    for tn in all_topic_notes:
        t = tn.get("mistake_tag")
        if t:
            tag_counts[t] = tag_counts.get(t, 0) + 1
        else:
            untagged_count += 1

    # Filter by tag and search query q
    tag_filter = (tag or "").strip()
    search_filter = (q or "").strip().lower()

    def _matches_q_item(it: Dict[str, Any]) -> bool:
        if tag_filter == "__untagged__":
            if it.get("mistake_tag"):
                return False
        elif tag_filter and tag_filter != "all":
            if it.get("mistake_tag") != tag_filter:
                return False
        if not search_filter:
            return True
        hay = " ".join(
            [
                str(it.get("id", "")),
                it.get("category") or "",
                it.get("topic_title_th") or "",
                it.get("question_text") or "",
                it.get("note_text") or "",
                it.get("mistake_tag") or "",
                it.get("core_principle") or "",
                it.get("key_takeaway") or "",
                it.get("common_pitfall") or "",
            ]
        ).lower()
        return search_filter in hay

    def _matches_topic_note(tn: Dict[str, Any]) -> bool:
        if tag_filter == "__untagged__":
            if tn.get("mistake_tag"):
                return False
        elif tag_filter and tag_filter != "all":
            if tn.get("mistake_tag") != tag_filter:
                return False
        if not search_filter:
            return True
        hay = " ".join(
            [
                tn.get("topic_id") or "",
                tn.get("topic_title_th") or "",
                tn.get("topic_title_en") or "",
                tn.get("note_text") or "",
                tn.get("mistake_tag") or "",
            ]
        ).lower()
        return search_filter in hay

    filtered_items = [it for it in all_vault_items if _matches_q_item(it)]
    filtered_topic_notes = [tn for tn in all_topic_notes if _matches_topic_note(tn)]

    return {
        "tag_options": MISTAKE_TAG_OPTIONS,
        "tag_counts": tag_counts,
        "untagged_count": untagged_count,
        "summary": {
            "total_bookmarks": len(bm_rows),
            "total_question_notes": sum(1 for n in note_rows if (n.note_text or "").strip()),
            "total_topic_notes": len(all_topic_notes),
            "total_repeat_wrong": len(repeat_wrong),
        },
        "items": filtered_items,
        "topic_notes": filtered_topic_notes,
        "repeat_wrong": repeat_wrong,
    }


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
    """List all personal question notes of the current user."""
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
    """Create, update, or append a personal note on a Question or Must-Know Topic (with optional mistake_tag)."""
    now = int(time.time())
    clean_tag = (req.mistake_tag or "").strip() or None
    incoming_text = (req.note_text or "").strip()

    if req.question_id is not None:
        question = (
            db.query(models.Question).filter(models.Question.id == req.question_id).first()
        )
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")
        resolved_topic = (req.topic_id or "").strip() or question.must_know_topic or None

        note = (
            db.query(models.UserNote)
            .filter(
                models.UserNote.user_id == current_user.id,
                models.UserNote.question_id == req.question_id,
            )
            .first()
        )
        if note:
            if req.append and (note.note_text or "").strip() and incoming_text:
                note.note_text = f"{note.note_text.strip()}\n\n---\n{incoming_text}"[:8000]
            else:
                note.note_text = req.note_text
            if clean_tag is not None:
                note.mistake_tag = clean_tag
            elif req.mistake_tag == "":
                note.mistake_tag = None
            if resolved_topic:
                note.topic_id = resolved_topic
            note.updated_at = now
        else:
            note = models.UserNote(
                user_id=current_user.id,
                question_id=req.question_id,
                topic_id=resolved_topic,
                mistake_tag=clean_tag,
                note_text=req.note_text,
                updated_at=now,
            )
            db.add(note)
        db.commit()
        db.refresh(note)
        return note

    clean_topic = (req.topic_id or "").strip()
    if not clean_topic:
        raise HTTPException(status_code=400, detail="Either question_id or topic_id is required")

    tnote = (
        db.query(models.UserTopicNote)
        .filter(
            models.UserTopicNote.user_id == current_user.id,
            models.UserTopicNote.topic_id == clean_topic,
        )
        .first()
    )
    if tnote:
        if req.append and (tnote.note_text or "").strip() and incoming_text:
            tnote.note_text = f"{tnote.note_text.strip()}\n\n---\n{incoming_text}"[:8000]
        else:
            tnote.note_text = req.note_text
        if clean_tag is not None:
            tnote.mistake_tag = clean_tag
        elif req.mistake_tag == "":
            tnote.mistake_tag = None
        tnote.updated_at = now
    else:
        tnote = models.UserTopicNote(
            user_id=current_user.id,
            topic_id=clean_topic,
            mistake_tag=clean_tag,
            note_text=req.note_text,
            updated_at=now,
        )
        db.add(tnote)
    db.commit()
    db.refresh(tnote)
    return {
        "id": tnote.id,
        "question_id": None,
        "topic_id": tnote.topic_id,
        "mistake_tag": tnote.mistake_tag,
        "note_text": tnote.note_text,
        "updated_at": tnote.updated_at,
    }


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


@router.delete("/topic-notes/{topic_id}", status_code=204)
def delete_topic_note(
    topic_id: str,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete the personal note for a Must-Know Topic."""
    deleted = (
        db.query(models.UserTopicNote)
        .filter(
            models.UserTopicNote.user_id == current_user.id,
            models.UserTopicNote.topic_id == topic_id,
        )
        .delete()
    )
    db.commit()
    if not deleted:
        raise HTTPException(status_code=404, detail="Topic note not found")
    return None
