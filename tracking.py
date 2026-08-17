from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

import models
import schema
from database import get_db
from auth import get_current_user

router = APIRouter(prefix="/api/tracking", tags=["tracking"])

@router.post("/session", response_model=schema.ExamSessionResponse)
def submit_exam_session(session: schema.ExamSessionCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
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
    
    import time
    now_ts = int(time.time())
    
    for ans in session.answers:
        db_ans = models.UserAnswer(
            session_id=db_session.id,
            question_id=ans.question_id,
            selected_choice=ans.selected_choice,
            is_correct=1 if ans.is_correct else 0,
            time_spent_seconds=ans.time_spent_seconds,
        )
        db.add(db_ans)
        
        # --- Update Spaced Repetition Stats (SM-2 simplified) ---
        stat = db.query(models.UserQuestionStat).filter(
            models.UserQuestionStat.user_id == current_user.id,
            models.UserQuestionStat.question_id == ans.question_id
        ).first()
        
        if not stat:
            stat = models.UserQuestionStat(
                user_id=current_user.id,
                question_id=ans.question_id,
                repetitions=0,
                interval=0,
                ease_factor=250, # base 2.5
                next_review_date=now_ts
            )
            db.add(stat)
            
        q_score = 4 if ans.is_correct else 1 # Quality: 4=Correct, 1=Incorrect (lapse)
        
        if q_score >= 3:
            if stat.repetitions == 0:
                stat.interval = 1
            elif stat.repetitions == 1:
                stat.interval = 6
            else:
                stat.interval = round(stat.interval * (stat.ease_factor / 100))
            stat.repetitions += 1
        else:
            stat.repetitions = 0
            stat.interval = 1
            
        # Update ease factor: EF = EF + (0.1 - (5-q) * (0.08 + (5-q)*0.02))
        stat.ease_factor = stat.ease_factor + round((0.1 - (5 - q_score) * (0.08 + (5 - q_score) * 0.02)) * 100)
        if stat.ease_factor < 130:
            stat.ease_factor = 130
            
        # Set next review date
        stat.next_review_date = now_ts + (stat.interval * 86400) # days to seconds
    
    db.commit()
    return db_session

@router.get("/history", response_model=List[schema.ExamSessionResponse])
def get_user_history(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    sessions = db.query(models.ExamSession).filter(
        models.ExamSession.user_id == current_user.id
    ).order_by(models.ExamSession.start_time.desc()).all()
    return sessions

@router.get("/stats")
def get_user_stats(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Total sessions
    total_sessions = db.query(models.ExamSession).filter(models.ExamSession.user_id == current_user.id).count()
    
    # Total questions answered
    total_questions = db.query(models.UserAnswer).join(models.ExamSession).filter(
        models.ExamSession.user_id == current_user.id
    ).count()
    
    # Correct answers
    correct_answers = db.query(models.UserAnswer).join(models.ExamSession).filter(
        models.ExamSession.user_id == current_user.id,
        models.UserAnswer.is_correct == 1
    ).count()
    
    # Breakdown by category
    query = db.query(
        models.Question.category,
        func.count(models.UserAnswer.id).label('total'),
        func.sum(models.UserAnswer.is_correct).label('correct')
    ).join(
        models.UserAnswer, models.UserAnswer.question_id == models.Question.id
    ).join(
        models.ExamSession, models.ExamSession.id == models.UserAnswer.session_id
    ).filter(
        models.ExamSession.user_id == current_user.id
    ).group_by(models.Question.category).all()
    
    categories = []
    for row in query:
        cat_name, total, correct = row
        categories.append({
            "category": cat_name,
            "total": total,
            "correct": correct,
            "accuracy": round((correct / total) * 100) if total > 0 else 0
        })
        
    return {
        "total_sessions": total_sessions,
        "total_questions_answered": total_questions,
        "total_correct": correct_answers,
        "overall_accuracy": round((correct_answers / total_questions) * 100) if total_questions > 0 else 0,
        "category_stats": categories
    }

@router.get("/review-due")
def get_questions_due_for_review(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    import time
    now_ts = int(time.time())
    
    # Get stats due for review today
    due_stats = db.query(models.UserQuestionStat).filter(
        models.UserQuestionStat.user_id == current_user.id,
        models.UserQuestionStat.next_review_date <= now_ts
    ).all()
    
    due_question_ids = [stat.question_id for stat in due_stats]
    
    if not due_question_ids:
        return {"count": 0, "questions": []}
        
    # We shouldn't fetch all if there are thousands, limit to 20 for one review session
    limit = 20
    review_ids = due_question_ids[:limit]
    
    questions = db.query(models.Question).filter(models.Question.id.in_(review_ids)).all()
    
    result = []
    for q in questions:
        choices = [{"id": c.id, "label": c.label, "text": c.text} for c in q.choices]
        result.append({
            "id": q.id,
            "question_text": q.question_text,
            "stem": q.stem,
            "proposition": q.proposition,
            "category": q.category,
            "task": q.task,
            "choices": choices
        })
        
    return {
        "count": len(due_question_ids),
        "session_limit": limit,
        "questions": result
    }

@router.get("/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    # Get all mock exam sessions
    mock_sessions = db.query(models.ExamSession).filter(
        models.ExamSession.exam_type == 'mock'
    ).all()
    
    # Group by user_id, keeping the highest score
    best_scores = {}
    for s in mock_sessions:
        if s.user_id not in best_scores or s.score > best_scores[s.user_id].score:
            best_scores[s.user_id] = s
            
    # Sort by score descending
    sorted_sessions = sorted(list(best_scores.values()), key=lambda x: x.score, reverse=True)
    
    total_participants = len(sorted_sessions)
    
    result = []
    for rank, s in enumerate(sorted_sessions):
        # Calculate percentile: (Total - Rank) / Total * 100
        # rank is 0-indexed, so rank 0 (1st place) in 10 people = (10 - 1) / 10 = 90th percentile
        percentile = round(((total_participants - (rank + 1)) / total_participants) * 100, 1) if total_participants > 1 else 100.0
        
        # Get user email
        user = db.query(models.User).filter(models.User.id == s.user_id).first()
        display_name = user.email.split('@')[0] if user else f"User {s.user_id}"
        
        # Mask the display name a bit for privacy (e.g. doc***)
        if len(display_name) > 3:
            display_name = display_name[:3] + "***"
            
        result.append({
            "rank": rank + 1,
            "display_name": display_name,
            "score": s.score,
            "total_questions": s.total_questions,
            "percentile": percentile,
            "date": s.start_time
        })
        
    return {
        "total_participants": total_participants,
        "leaderboard": result
    }
