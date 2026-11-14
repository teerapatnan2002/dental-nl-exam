import math
import time
from datetime import datetime
from typing import Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy.orm import Session, selectinload

import models
import schema
from auth import get_current_user
from database import get_db
from learning import TOPIC_METADATA
from tos_blueprint import (
    TOS_CATEGORIES,
    TOS_COGNITIVE,
    TOS_TASKS,
    TOS_WEIGHT_MAP,
    TZ_BKK,
    is_mock_70_locked,
)

router = APIRouter(prefix="/api/tracking", tags=["tracking"])

_VALID_CONFIDENCE = {"confident", "unsure", "hard"}
_RATING_TO_SM2 = {
    1: (1, "review"),
    2: (3, "review"),
    3: (4, "mastered"),
    4: (5, "mastered"),
}
_STATUS_TO_SM2 = {
    "red": (1, "red"),
    "yellow": (3, "yellow"),
    "green": (5, "green"),
    "review": (2, "review"),
    "mastered": (4, "mastered"),
}


def _apply_sm2(stat, q_score: int, now_ts: int) -> None:
    """Apply SuperMemo-2 update in-place to a UserQuestionStat or UserCardReview."""
    if q_score >= 3:
        if stat.repetitions == 0:
            stat.interval = 1
        elif stat.repetitions == 1:
            stat.interval = 6
        else:
            stat.interval = max(1, round(stat.interval * (stat.ease_factor / 100)))
        stat.repetitions += 1
    else:
        stat.repetitions = 0
        stat.interval = 1
        stat.lapse_count = (stat.lapse_count or 0) + 1

    ef_delta = round((0.1 - (5 - q_score) * (0.08 + (5 - q_score) * 0.02)) * 100)
    stat.ease_factor = max(130, (stat.ease_factor or 250) + ef_delta)
    stat.last_quality = q_score
    stat.next_review_date = now_ts + (stat.interval * 86400)


def _question_sm2_quality(
    is_correct: bool,
    confidence: Optional[str],
    time_spent_seconds: Optional[int],
) -> int:
    conf = confidence if confidence in _VALID_CONFIDENCE else None
    if not is_correct:
        return 1
    if conf in ("unsure", "hard"):
        return 3
    if time_spent_seconds is not None and time_spent_seconds <= 45:
        return 5
    return 4


def _serialize_card_review(card: models.UserCardReview, now_ts: int) -> dict:
    days_until_due = (
        max(0, math.ceil((card.next_review_date - now_ts) / 86400))
        if card.next_review_date > now_ts
        else 0
    )
    return {
        "card_key": card.card_key,
        "card_type": card.card_type,
        "repetitions": card.repetitions,
        "interval": card.interval,
        "ease_factor": card.ease_factor,
        "last_quality": card.last_quality,
        "lapse_count": card.lapse_count or 0,
        "mastery_status": card.mastery_status,
        "next_review_date": card.next_review_date,
        "updated_at": card.updated_at,
        "days_until_due": days_until_due,
        "is_due": card.next_review_date <= now_ts,
    }


def _classify_readiness(accuracy: Optional[float], attempts: int) -> str:
    if attempts == 0 or accuracy is None:
        return "unpracticed"
    if accuracy < 60.0:
        return "critical"
    if accuracy < 75.0:
        return "borderline"
    return "ready"


def compute_user_readiness(current_user: models.User, db: Session) -> dict:
    """Overlay personal user performance onto the Thai Dental Council TOS 2563 blueprint."""
    locked = is_mock_70_locked()

    q_rows = db.query(
        models.Question.id,
        models.Question.category,
        models.Question.task,
        models.Question.cognitive_level,
        models.Question.must_know_topic,
        models.Question.source_exam,
    ).all()

    q_by_id: Dict[int, dict] = {}
    for qid, cat, task, cog, topic, src in q_rows:
        if locked and src and "2570" in src:
            continue
        q_by_id[qid] = {
            "id": qid,
            "category": cat or "Unknown",
            "task": task or "Unknown",
            "cognitive_level": cog or "A",
            "must_know_topic": topic or "",
        }

    # Fetch user's answer history chronologically so latest_by_qid reflects current mastery
    ans_rows = (
        db.query(
            models.UserAnswer.question_id,
            models.UserAnswer.is_correct,
            models.UserAnswer.confidence,
            models.ExamSession.start_time,
        )
        .join(models.ExamSession, models.ExamSession.id == models.UserAnswer.session_id)
        .filter(models.ExamSession.user_id == current_user.id)
        .order_by(models.ExamSession.start_time.asc(), models.UserAnswer.id.asc())
        .all()
    )

    total_attempts = 0
    latest_by_qid: Dict[int, dict] = {}
    wrong_counts: Dict[int, int] = {}
    for qid, is_corr, conf, _ts in ans_rows:
        if qid not in q_by_id:
            continue
        total_attempts += 1
        correct_bool = bool(is_corr)
        if not correct_bool:
            wrong_counts[qid] = wrong_counts.get(qid, 0) + 1
        latest_by_qid[qid] = {
            "is_correct": correct_bool,
            "confidence": conf,
        }

    # Aggregate bank counts and user unique mastery across Category / Task / Cognitive / Topic
    cat_bank: Dict[str, int] = {}
    cat_ans: Dict[str, int] = {}
    cat_corr: Dict[str, int] = {}
    cat_topics: Dict[str, Dict[str, int]] = {}

    task_bank: Dict[str, int] = {}
    task_ans: Dict[str, int] = {}
    task_corr: Dict[str, int] = {}

    cog_bank: Dict[str, int] = {}
    cog_ans: Dict[str, int] = {}
    cog_corr: Dict[str, int] = {}

    topic_qids: Dict[str, List[int]] = {}
    topic_ans_qids: Dict[str, List[int]] = {}
    topic_wrong_qids: Dict[str, List[int]] = {}
    topic_corr: Dict[str, int] = {}
    topic_cat: Dict[str, str] = {}

    for qid, q in q_by_id.items():
        cat = q["category"]
        task = q["task"]
        cog = q["cognitive_level"]
        topic = q["must_know_topic"]

        cat_bank[cat] = cat_bank.get(cat, 0) + 1
        if cat != "กฎหมายและจรรยาบรรณ":
            task_bank[task] = task_bank.get(task, 0) + 1
        cog_bank[cog] = cog_bank.get(cog, 0) + 1

        if topic:
            topic_cat.setdefault(topic, cat)
            topic_qids.setdefault(topic, []).append(qid)
            cat_topics.setdefault(cat, {})
            cat_topics[cat][topic] = cat_topics[cat].get(topic, 0) + 1

        res = latest_by_qid.get(qid)
        if res is not None:
            is_c = res["is_correct"]
            cat_ans[cat] = cat_ans.get(cat, 0) + 1
            if is_c:
                cat_corr[cat] = cat_corr.get(cat, 0) + 1

            if cat != "กฎหมายและจรรยาบรรณ":
                task_ans[task] = task_ans.get(task, 0) + 1
                if is_c:
                    task_corr[task] = task_corr.get(task, 0) + 1

            cog_ans[cog] = cog_ans.get(cog, 0) + 1
            if is_c:
                cog_corr[cog] = cog_corr.get(cog, 0) + 1

            if topic:
                topic_ans_qids.setdefault(topic, []).append(qid)
                if is_c:
                    topic_corr[topic] = topic_corr.get(topic, 0) + 1
                else:
                    topic_wrong_qids.setdefault(topic, []).append(qid)

    # Category readiness & ROI calculation
    category_readiness = []
    practiced_weight_sum = 0.0
    practiced_weighted_correct = 0.0
    total_weight_sum = 0.0
    projected_weighted_sum = 0.0

    for tc in TOS_CATEGORIES:
        cat = tc["category"]
        weight = tc["target_pct"]
        in_bank = cat_bank.get(cat, 0)
        u_ans = cat_ans.get(cat, 0)
        u_corr = cat_corr.get(cat, 0)
        acc = round((u_corr / u_ans) * 100, 1) if u_ans > 0 else None
        cov = round((u_ans / in_bank) * 100, 1) if in_bank > 0 else 0.0
        status = _classify_readiness(acc, u_ans)

        total_weight_sum += weight
        if acc is not None:
            practiced_weight_sum += weight
            practiced_weighted_correct += weight * acc
            # Readiness blend: accuracy with coverage confidence ramp (reaches full weight by 15 Qs)
            conf_factor = min(1.0, u_ans / 15.0)
            projected_weighted_sum += weight * (acc * conf_factor)

        weakness = (100.0 - acc) if acc is not None else 55.0
        roi_score = round((weight / 10.0) * weakness, 1)

        top_cat_topics = sorted(
            cat_topics.get(cat, {}).items(), key=lambda item: item[1], reverse=True
        )[:3]

        category_readiness.append(
            {
                "category": cat,
                "target_pct": weight,
                "total_in_bank": in_bank,
                "unique_answered": u_ans,
                "coverage_pct": cov,
                "correct": u_corr,
                "accuracy": acc,
                "status": status,
                "roi_score": roi_score,
                "recommended_topic_ids": [t_id for t_id, _cnt in top_cat_topics],
            }
        )

    # Task readiness
    task_readiness = []
    for tt in TOS_TASKS:
        t_name = tt["task"]
        in_bank = task_bank.get(t_name, 0)
        u_ans = task_ans.get(t_name, 0)
        u_corr = task_corr.get(t_name, 0)
        acc = round((u_corr / u_ans) * 100, 1) if u_ans > 0 else None
        task_readiness.append(
            {
                "task": t_name,
                "target_pct": tt["target_pct"],
                "total_in_bank": in_bank,
                "unique_answered": u_ans,
                "correct": u_corr,
                "accuracy": acc,
                "status": _classify_readiness(acc, u_ans),
            }
        )

    # Cognitive readiness (R / A / P)
    cognitive_readiness = []
    for tcog in TOS_COGNITIVE:
        lvl = tcog["level"]
        in_bank = cog_bank.get(lvl, 0)
        u_ans = cog_ans.get(lvl, 0)
        u_corr = cog_corr.get(lvl, 0)
        acc = round((u_corr / u_ans) * 100, 1) if u_ans > 0 else None
        cognitive_readiness.append(
            {
                "level": lvl,
                "name": tcog["name"],
                "target_pct": tcog["target_pct"],
                "total_in_bank": in_bank,
                "unique_answered": u_ans,
                "correct": u_corr,
                "accuracy": acc,
                "status": _classify_readiness(acc, u_ans),
            }
        )

    # Top High-ROI Weak Topics (combining wrong answers + unpracticed high-yield topics)
    weak_topic_candidates = []
    for topic_id, qids in topic_qids.items():
        total_in_topic = len(qids)
        ans_ids = topic_ans_qids.get(topic_id, [])
        u_ans = len(ans_ids)
        u_corr = topic_corr.get(topic_id, 0)
        wrong_ids = topic_wrong_qids.get(topic_id, [])
        acc = round((u_corr / u_ans) * 100, 1) if u_ans > 0 else None

        cat = topic_cat.get(topic_id, "")
        cat_weight = TOS_WEIGHT_MAP.get(cat, 8.0)

        # Skip topics where user is already strong (>= 85% with >= 5 answered)
        if acc is not None and acc >= 85.0 and u_ans >= 5:
            continue

        if acc is not None:
            weakness_factor = (100.0 - acc) + (20.0 if len(wrong_ids) >= 2 else 0.0)
            reason_th = f"ทำแล้ว {u_ans}/{total_in_topic} ข้อ • ความแม่นยำ {acc}% (น้ำหนัก TOS {cat_weight}%)"
        else:
            weakness_factor = 48.0
            reason_th = f"ยังไม่เคยฝึก ({total_in_topic} ข้อในคลัง • น้ำหนัก TOS {cat_weight}%)"

        freq_multiplier = min(2.0, math.log2(total_in_topic + 2) / 3.0)
        roi_score = round((cat_weight / 10.0) * weakness_factor * freq_multiplier, 1)

        # Prioritize wrong questions -> unsure answered -> unpracticed questions (max 20)
        ans_set = set(ans_ids)
        wrong_set = set(wrong_ids)
        unsure_ids = [
            qid
            for qid in ans_ids
            if qid not in wrong_set and latest_by_qid.get(qid, {}).get("confidence") in ("unsure", "hard")
        ]
        unseen_ids = [qid for qid in qids if qid not in ans_set]
        target_qids = (wrong_ids + unsure_ids + unseen_ids)[:20]
        if not target_qids:
            target_qids = qids[:20]

        meta = TOPIC_METADATA.get(topic_id, {})
        weak_topic_candidates.append(
            {
                "topic_id": topic_id,
                "title_th": meta.get("title_th") or topic_id,
                "category": cat,
                "total_in_bank": total_in_topic,
                "unique_answered": u_ans,
                "wrong_count": len(wrong_ids),
                "accuracy": acc,
                "roi_score": roi_score,
                "reason_th": reason_th,
                "question_ids": target_qids,
            }
        )

    weak_topic_candidates.sort(key=lambda x: (-x["roi_score"], -x["total_in_bank"]))
    top_weak_topics = weak_topic_candidates[:8]

    total_in_bank = len(q_by_id)
    unique_answered = len(latest_by_qid)
    unique_correct = sum(1 for v in latest_by_qid.values() if v["is_correct"])
    overall_accuracy = round((unique_correct / unique_answered) * 100, 1) if unique_answered > 0 else 0.0
    coverage_pct = round((unique_answered / total_in_bank) * 100, 1) if total_in_bank > 0 else 0.0

    weighted_accuracy_pct = (
        round(practiced_weighted_correct / practiced_weight_sum, 1)
        if practiced_weight_sum > 0
        else 0.0
    )
    projected_nl_score = (
        round(projected_weighted_sum / total_weight_sum, 1) if total_weight_sum > 0 else 0.0
    )

    critical_count = sum(1 for c in category_readiness if c["status"] == "critical")
    unpracticed_count = sum(1 for c in category_readiness if c["status"] == "unpracticed")

    return {
        "summary": {
            "total_in_bank": total_in_bank,
            "unique_answered": unique_answered,
            "unique_correct": unique_correct,
            "total_attempts": total_attempts,
            "coverage_pct": coverage_pct,
            "overall_accuracy": overall_accuracy,
            "weighted_accuracy_pct": weighted_accuracy_pct,
            "projected_nl_score": projected_nl_score,
            "passing_threshold": 60.0,
            "critical_categories_count": critical_count,
            "unpracticed_categories_count": unpracticed_count,
            "practiced_categories_count": len(category_readiness) - unpracticed_count,
        },
        "category_readiness": category_readiness,
        "task_readiness": task_readiness,
        "cognitive_readiness": cognitive_readiness,
        "top_weak_topics": top_weak_topics,
    }


@router.post("/session", response_model=schema.ExamSessionResponse)
def submit_exam_session(
    session: schema.ExamSessionCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db_session = models.ExamSession(
        user_id=current_user.id,
        start_time=session.start_time,
        end_time=session.end_time,
        exam_type=session.exam_type,
        score=session.score,
        total_questions=session.total_questions,
        time_limit_seconds=session.time_limit_seconds,
        time_spent_seconds=session.time_spent_seconds,
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)

    now_ts = int(time.time())

    # Batch-load existing SM-2 stats for questions in this submission to avoid N+1 queries
    qids = [ans.question_id for ans in session.answers]
    existing_stats = (
        db.query(models.UserQuestionStat)
        .filter(
            models.UserQuestionStat.user_id == current_user.id,
            models.UserQuestionStat.question_id.in_(qids),
        )
        .all()
        if qids
        else []
    )
    stat_by_qid = {s.question_id: s for s in existing_stats}

    for ans in session.answers:
        conf = ans.confidence if ans.confidence in _VALID_CONFIDENCE else None
        db_ans = models.UserAnswer(
            session_id=db_session.id,
            question_id=ans.question_id,
            selected_choice=ans.selected_choice,
            is_correct=1 if ans.is_correct else 0,
            time_spent_seconds=ans.time_spent_seconds,
            confidence=conf,
        )
        db.add(db_ans)

        stat = stat_by_qid.get(ans.question_id)
        if not stat:
            stat = models.UserQuestionStat(
                user_id=current_user.id,
                question_id=ans.question_id,
                repetitions=0,
                interval=0,
                ease_factor=250,
                lapse_count=0,
                next_review_date=now_ts,
            )
            db.add(stat)
            stat_by_qid[ans.question_id] = stat

        q_score = _question_sm2_quality(ans.is_correct, conf, ans.time_spent_seconds)
        stat.last_confidence = conf
        stat.last_reviewed_at = now_ts
        _apply_sm2(stat, q_score, now_ts)

    db.commit()
    return db_session


@router.get("/history", response_model=List[schema.ExamSessionResponse])
def get_user_history(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(models.ExamSession)
        .filter(models.ExamSession.user_id == current_user.id)
        .order_by(models.ExamSession.start_time.desc())
        .all()
    )


@router.get("/stats")
def get_user_stats(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    total_sessions = (
        db.query(models.ExamSession)
        .filter(models.ExamSession.user_id == current_user.id)
        .count()
    )
    total_questions = (
        db.query(models.UserAnswer)
        .join(models.ExamSession)
        .filter(models.ExamSession.user_id == current_user.id)
        .count()
    )
    correct_answers = (
        db.query(models.UserAnswer)
        .join(models.ExamSession)
        .filter(
            models.ExamSession.user_id == current_user.id,
            models.UserAnswer.is_correct == 1,
        )
        .count()
    )

    query = (
        db.query(
            models.Question.category,
            func.count(models.UserAnswer.id).label("total"),
            func.sum(models.UserAnswer.is_correct).label("correct"),
        )
        .join(models.UserAnswer, models.UserAnswer.question_id == models.Question.id)
        .join(models.ExamSession, models.ExamSession.id == models.UserAnswer.session_id)
        .filter(models.ExamSession.user_id == current_user.id)
        .group_by(models.Question.category)
        .all()
    )

    categories = []
    for cat_name, total, correct in query:
        correct_int = int(correct or 0)
        categories.append(
            {
                "category": cat_name,
                "total": total,
                "correct": correct_int,
                "accuracy": round((correct_int / total) * 100) if total > 0 else 0,
            }
        )

    return {
        "total_sessions": total_sessions,
        "total_questions_answered": total_questions,
        "total_correct": correct_answers,
        "overall_accuracy": round((correct_answers / total_questions) * 100) if total_questions > 0 else 0,
        "category_stats": categories,
    }


@router.get("/review-due")
def get_questions_due_for_review(
    limit: int = Query(20, ge=1, le=100),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    now_ts = int(time.time())

    due_stats = (
        db.query(models.UserQuestionStat)
        .filter(
            models.UserQuestionStat.user_id == current_user.id,
            models.UserQuestionStat.next_review_date <= now_ts,
        )
        .order_by(
            models.UserQuestionStat.next_review_date.asc(),
            models.UserQuestionStat.ease_factor.asc(),
        )
        .all()
    )

    due_question_ids = [stat.question_id for stat in due_stats]
    if not due_question_ids:
        return {"count": 0, "total_due": 0, "session_limit": limit, "questions": []}

    review_ids = due_question_ids[:limit]
    questions = (
        db.query(models.Question)
        .options(selectinload(models.Question.choices))
        .filter(models.Question.id.in_(review_ids))
        .all()
    )
    q_map = {q.id: q for q in questions}
    locked = is_mock_70_locked()

    result = []
    for qid in review_ids:
        q = q_map.get(qid)
        if not q:
            continue
        if locked and q.source_exam and "2570" in q.source_exam:
            continue
        result.append(
            {
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
                "cognitive_level": q.cognitive_level,
                "must_know_topic": q.must_know_topic,
                "choices": [{"id": c.id, "label": c.label, "text": c.text} for c in q.choices],
            }
        )

    return {
        "count": len(due_question_ids),
        "total_due": len(due_question_ids),
        "session_limit": limit,
        "questions": result,
    }


@router.get("/cards")
def get_user_card_reviews(
    card_type: Optional[str] = Query(None, pattern="^(flashcard|topic|cloze)$"),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    now_ts = int(time.time())
    query = db.query(models.UserCardReview).filter(
        models.UserCardReview.user_id == current_user.id
    )
    if card_type:
        query = query.filter(models.UserCardReview.card_type == card_type)

    rows = query.order_by(models.UserCardReview.next_review_date.asc()).all()
    cards = [_serialize_card_review(c, now_ts) for c in rows]
    due_flashcards = sum(
        1 for c in cards if c["card_type"] == "flashcard" and c["is_due"]
    )
    due_topics = sum(1 for c in cards if c["card_type"] == "topic" and c["is_due"])
    mastered_flashcards = sum(
        1
        for c in cards
        if c["card_type"] == "flashcard" and c["mastery_status"] == "mastered"
    )
    return {
        "cards": cards,
        "due_flashcard_count": due_flashcards,
        "due_topic_count": due_topics,
        "mastered_flashcard_count": mastered_flashcards,
        "total_synced": len(cards),
    }


@router.post("/cards/review")
def review_card_sm2(
    payload: schema.CardReviewSubmit,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    now_ts = int(time.time())
    if payload.rating is not None:
        q_score, default_status = _RATING_TO_SM2[payload.rating]
        resolved_status = payload.mastery_status or default_status
    elif payload.mastery_status and payload.mastery_status in _STATUS_TO_SM2:
        q_score, resolved_status = _STATUS_TO_SM2[payload.mastery_status]
    else:
        raise HTTPException(
            status_code=422,
            detail="Either rating (1-4) or valid mastery_status is required.",
        )

    card = (
        db.query(models.UserCardReview)
        .filter(
            models.UserCardReview.user_id == current_user.id,
            models.UserCardReview.card_key == payload.card_key,
            models.UserCardReview.card_type == payload.card_type,
        )
        .first()
    )
    if not card:
        card = models.UserCardReview(
            user_id=current_user.id,
            card_key=payload.card_key,
            card_type=payload.card_type,
            repetitions=0,
            interval=0,
            ease_factor=250,
            lapse_count=0,
            mastery_status=resolved_status,
            next_review_date=now_ts,
            updated_at=now_ts,
        )
        db.add(card)
    else:
        card.mastery_status = resolved_status
        card.updated_at = now_ts

    _apply_sm2(card, q_score, now_ts)
    db.commit()
    db.refresh(card)
    return _serialize_card_review(card, now_ts)


@router.post("/cards/sync")
def sync_local_cards_to_db(
    payload: schema.CardReviewSyncBatch,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Idempotently seed localStorage flashcard/topic mastery without overwriting newer DB SM-2 state."""
    now_ts = int(time.time())
    existing_rows = (
        db.query(models.UserCardReview)
        .filter(models.UserCardReview.user_id == current_user.id)
        .all()
    )
    existing_keys = {(r.card_type, r.card_key) for r in existing_rows}

    inserted = 0
    for item in payload.items:
        key_tuple = (item.card_type, item.card_key)
        if key_tuple in existing_keys:
            continue
        q_score, resolved_status = _STATUS_TO_SM2.get(
            item.mastery_status, (2, item.mastery_status)
        )
        card = models.UserCardReview(
            user_id=current_user.id,
            card_key=item.card_key,
            card_type=item.card_type,
            repetitions=0,
            interval=0,
            ease_factor=250,
            lapse_count=0,
            mastery_status=resolved_status,
            next_review_date=now_ts,
            updated_at=now_ts,
        )
        _apply_sm2(card, q_score, now_ts)
        db.add(card)
        existing_keys.add(key_tuple)
        inserted += 1

    if inserted > 0:
        db.commit()

    all_rows = (
        db.query(models.UserCardReview)
        .filter(models.UserCardReview.user_id == current_user.id)
        .all()
    )
    return {
        "inserted": inserted,
        "cards": [_serialize_card_review(c, now_ts) for c in all_rows],
    }


@router.get("/my-readiness")
def get_my_readiness(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return compute_user_readiness(current_user, db)


@router.get("/daily-plan")
def get_daily_study_plan(
    days_until_exam: Optional[int] = Query(None, ge=1, le=365),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    now_ts = int(time.time())
    bkk_midnight = datetime.now(TZ_BKK).replace(hour=0, minute=0, second=0, microsecond=0)
    today_start_ts = int(bkk_midnight.timestamp())

    answered_today = (
        db.query(func.count(models.UserAnswer.id))
        .join(models.ExamSession, models.ExamSession.id == models.UserAnswer.session_id)
        .filter(
            models.ExamSession.user_id == current_user.id,
            models.ExamSession.start_time >= today_start_ts,
        )
        .scalar()
        or 0
    )

    due_q_rows = (
        db.query(models.UserQuestionStat.question_id)
        .filter(
            models.UserQuestionStat.user_id == current_user.id,
            models.UserQuestionStat.next_review_date <= now_ts,
        )
        .order_by(
            models.UserQuestionStat.next_review_date.asc(),
            models.UserQuestionStat.ease_factor.asc(),
        )
        .all()
    )
    due_q_ids = [r[0] for r in due_q_rows]

    due_flashcards = (
        db.query(func.count(models.UserCardReview.id))
        .filter(
            models.UserCardReview.user_id == current_user.id,
            models.UserCardReview.card_type == "flashcard",
            models.UserCardReview.next_review_date <= now_ts,
        )
        .scalar()
        or 0
    )
    due_topics = (
        db.query(func.count(models.UserCardReview.id))
        .filter(
            models.UserCardReview.user_id == current_user.id,
            models.UserCardReview.card_type == "topic",
            models.UserCardReview.next_review_date <= now_ts,
        )
        .scalar()
        or 0
    )

    readiness = compute_user_readiness(current_user, db)
    summary = readiness["summary"]
    top_weak = readiness["top_weak_topics"][0] if readiness["top_weak_topics"] else None

    remaining_bank = max(0, summary["total_in_bank"] - summary["unique_answered"])
    if days_until_exam:
        pace = math.ceil((remaining_bank * 0.35 + len(due_q_ids)) / max(1, days_until_exam))
        daily_target = min(60, max(15, pace))
    else:
        daily_target = max(20, min(40, len(due_q_ids) + 15))

    return {
        "answered_today": int(answered_today),
        "daily_target_questions": daily_target,
        "due_questions_count": len(due_q_ids),
        "due_question_ids": due_q_ids[:20],
        "due_flashcards_count": int(due_flashcards),
        "due_topics_count": int(due_topics),
        "recommended_weak_topic": top_weak,
        "readiness_summary": summary,
    }


@router.get("/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    mock_sessions = (
        db.query(models.ExamSession)
        .filter(models.ExamSession.exam_type == "mock")
        .all()
    )

    best_scores = {}
    for s in mock_sessions:
        if s.user_id not in best_scores or (s.score or 0) > (best_scores[s.user_id].score or 0):
            best_scores[s.user_id] = s

    sorted_sessions = sorted(
        list(best_scores.values()), key=lambda x: x.score or 0, reverse=True
    )
    total_participants = len(sorted_sessions)

    result = []
    for rank, s in enumerate(sorted_sessions):
        percentile = (
            round(((total_participants - (rank + 1)) / total_participants) * 100, 1)
            if total_participants > 1
            else 100.0
        )
        user = db.query(models.User).filter(models.User.id == s.user_id).first()
        display_name = user.email.split("@")[0] if user else f"User {s.user_id}"
        if len(display_name) > 3:
            display_name = display_name[:3] + "***"

        result.append(
            {
                "rank": rank + 1,
                "display_name": display_name,
                "score": s.score,
                "total_questions": s.total_questions,
                "percentile": percentile,
                "date": s.start_time,
            }
        )

    return {"total_participants": total_participants, "leaderboard": result}
