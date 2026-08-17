import os
import re
import json
import random
import logging
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException, Query, Request
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session, selectinload
from sqlalchemy.sql.expression import func
from sqlalchemy import or_, text
from pydantic import BaseModel

from database import (
    SessionLocal,
    engine,
    Base,
    get_db,
    run_migrations,
    run_fts_migration,
)
import models
from schema import ClinicalCategory, ProfessionalTask
from explainer import explain_question_async

# ── Logging ──
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger(__name__)

# Create tables if not exist, then apply lightweight column/FTS migrations
Base.metadata.create_all(bind=engine)
run_migrations()
run_fts_migration()

app = FastAPI(title="Dental Exam API")

# ── Import routers ──
from auth import router as auth_router, get_current_user
from tracking import router as tracking_router
from tutor import router as tutor_router
from reports import router as reports_router
from bookmarks import router as bookmarks_router

app.include_router(auth_router)
app.include_router(tracking_router)
app.include_router(tutor_router)
app.include_router(reports_router)
app.include_router(bookmarks_router)

# ── CORS: read allowed origins from env, default to localhost only ──
_allowed_origins_env = os.environ.get("ALLOWED_ORIGINS", "")
if _allowed_origins_env:
    allowed_origins = [o.strip() for o in _allowed_origins_env.split(",") if o.strip()]
else:
    allowed_origins = ["http://localhost:5173", "http://localhost:8000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Security Headers Middleware ──


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Cache-Control"] = "no-store, max-age=0"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    return response

# GZip middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Serve static images
os.makedirs("images", exist_ok=True)
app.mount("/images", StaticFiles(directory="images"), name="images")


# ── Health endpoint ──
@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "Dental Exam API"}


# ── Response Schemas ──
class ChoiceResponse(BaseModel):
    id: int
    label: str
    text: str

    class Config:
        from_attributes = True


class QuestionResponse(BaseModel):
    id: int
    question_text: str
    stem: Optional[str] = None
    proposition: Optional[str] = None
    category: str
    task: str
    correct_answer: Optional[str] = None
    explanation: Optional[str] = None
    source_exam: Optional[str] = None
    image_path: Optional[str] = None
    choices: List[dict] = []

    class Config:
        from_attributes = True


def _serialize_question(q: models.Question) -> dict:
    """Serialize a Question ORM object. Expects `choices` to be eager-loaded
    via selectinload to avoid N+1 queries."""
    choices = [{"label": c.label, "text": c.text} for c in q.choices]
    return {
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
        "choices": choices,
    }


# ── Public endpoints (no auth required) ──

@app.get("/api/categories")
def get_categories():
    return {
        "categories": [c.value for c in ClinicalCategory],
        "tasks": [t.value for t in ProfessionalTask],
    }


@app.get("/api/stats")
def get_stats(db: Session = Depends(get_db)):
    cat_stats = (
        db.query(models.Question.category, func.count(models.Question.id))
        .group_by(models.Question.category)
        .all()
    )
    task_stats = (
        db.query(models.Question.task, func.count(models.Question.id))
        .group_by(models.Question.task)
        .all()
    )
    return {
        "categories": [{"category": c, "count": count} for c, count in cat_stats],
        "tasks": [{"task": t, "count": count} for t, count in task_stats],
    }


@app.get("/api/years")
def get_years(db: Session = Depends(get_db)):
    questions = db.query(
        models.Question.id,
        models.Question.source_exam,
        models.Question.category,
        models.Question.task,
        models.Question.stem,
        models.Question.question_text
    ).all()

    year_stats = {}
    for qid, exam, cat, task, stem, qtxt in questions:
        if not exam:
            continue
        match = re.search(r"(20\d{2}|25\d{2})", exam)
        if match:
            y_int = int(match.group(1))
            if y_int < 2500:
                y_int += 543
            y = str(y_int)
            if y not in year_stats:
                year_stats[y] = {
                    "total": 0,
                    "law_count": 0,
                    "clinical_count": 0,
                    "categories": {},
                    "tasks": {},
                    "parts": {
                        "1": {"count": 0, "stems": set()},
                        "2": {"count": 0, "stems": set()},
                        "3": {"count": 0, "stems": set()},
                        "4": {"count": 0, "stems": set()},
                        "law": {"count": 0, "stems": set()}
                    }
                }
            s = year_stats[y]
            s["total"] += 1
            is_law = (cat == "กฎหมายและจรรยาบรรณ") or bool(re.search(r"(law|กฎหมาย|กฏหมาย)", exam.lower()))
            
            if is_law:
                s["law_count"] += 1
                s["parts"]["law"]["count"] += 1
            else:
                s["clinical_count"] += 1
                pm = re.search(r'part[_\s]*(\d)', exam.lower())
                if pm and pm.group(1) in ["1", "2", "3", "4"]:
                    p_num = pm.group(1)
                    s["parts"][p_num]["count"] += 1
                    if stem and stem.strip() and stem.strip() != (qtxt or "").strip():
                        s["parts"][p_num]["stems"].add(stem.strip())
                else:
                    # Generic / combined exam: distribute by STEM index or quarter
                    pass

            if cat:
                s["categories"][cat] = s["categories"].get(cat, 0) + 1
            if task:
                s["tasks"][task] = s["tasks"].get(task, 0) + 1

    result = []
    for y in sorted(year_stats.keys(), reverse=True):
        s = year_stats[y]
        cats_sorted = [
            {"name": k, "count": v}
            for k, v in sorted(s["categories"].items(), key=lambda x: x[1], reverse=True)
        ]
        tasks_sorted = [
            {"name": k, "count": v}
            for k, v in sorted(s["tasks"].items(), key=lambda x: x[1], reverse=True)
        ]
        
        parts_data = {}
        for p_k, p_v in s["parts"].items():
            parts_data[p_k] = {
                "count": p_v["count"],
                "stems": len(p_v["stems"])
            }

        # If it's a combined year (e.g. 2025 where parts were not split), estimate 4 parts from clinical
        if parts_data["1"]["count"] == 0 and s["clinical_count"] > 0:
            quarter = s["clinical_count"] // 4
            for p_k in ["1", "2", "3", "4"]:
                parts_data[p_k]["count"] = quarter
                parts_data[p_k]["stems"] = 25

        result.append(
            {
                "year": y,
                "total": s["total"],
                "law_count": s["law_count"],
                "clinical_count": s["clinical_count"],
                "categories": cats_sorted,
                "tasks": tasks_sorted,
                "parts": parts_data,
            }
        )
    return {"years_data": result}


@app.get("/api/questions", response_model=List[QuestionResponse])
def get_questions(
    category: Optional[str] = None,
    task: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    query = db.query(models.Question).options(selectinload(models.Question.choices))
    if category:
        query = query.filter(models.Question.category == category)
    if task:
        query = query.filter(models.Question.task == task)

    questions = query.offset(skip).limit(limit).all()
    return [_serialize_question(q) for q in questions]


@app.get("/api/search", response_model=List[QuestionResponse])
def search_questions(
    q: str = Query(..., min_length=2, max_length=200),
    category: Optional[str] = None,
    limit: int = Query(30, gt=0, le=100),
    db: Session = Depends(get_db),
):
    """Full-text search over question text/stem/proposition via SQLite FTS5.
    Falls back to LIKE matching if the FTS table is unavailable."""
    fts_available = db.execute(
        text("SELECT name FROM sqlite_master WHERE type='table' AND name='questions_fts'")
    ).first()

    # The trigram tokenizer needs terms of >= 3 characters; use LIKE for shorter input
    use_fts = bool(fts_available) and len(q.strip()) >= 3

    question_ids: list[int] = []
    if use_fts:
        # Quote the whole input for FTS safety; trigram gives substring matching
        safe_q = '"' + q.strip().replace('"', "") + '"'
        rows = db.execute(
            text(
                "SELECT rowid FROM questions_fts WHERE questions_fts MATCH :match LIMIT :lim"
            ),
            {"match": safe_q, "lim": limit},
        ).fetchall()
        question_ids = [r[0] for r in rows]

    query = db.query(models.Question).options(selectinload(models.Question.choices))
    if question_ids:
        query = query.filter(models.Question.id.in_(question_ids))
    elif not use_fts:
        like = f"%{q}%"
        query = query.filter(
            or_(
                models.Question.question_text.like(like),
                models.Question.stem.like(like),
                models.Question.proposition.like(like),
            )
        ).limit(limit)
    else:
        return []  # FTS available but no matches

    if category:
        query = query.filter(models.Question.category == category)

    questions = query.all()
    return [_serialize_question(qs) for qs in questions]


@app.get("/api/exam/random", response_model=List[QuestionResponse])
def generate_random_exam(
    n: int = Query(10, gt=0, le=1000),
    category: Optional[str] = None,
    task: Optional[str] = None,
    year: Optional[str] = None,
    part: Optional[str] = None,
    ordered: bool = False,
    clinical_only: bool = False,
    db: Session = Depends(get_db),
):
    query = db.query(models.Question).options(selectinload(models.Question.choices))
    if category:
        query = query.filter(models.Question.category == category)
    if clinical_only:
        query = query.filter(models.Question.category != "กฎหมายและจรรยาบรรณ")
    if task:
        query = query.filter(models.Question.task == task)
    if year:
        try:
            y_be = int(year)
            y_ce = y_be - 543
            query = query.filter(
                or_(
                    models.Question.source_exam.like(f"%{y_be}%"),
                    models.Question.source_exam.like(f"%{y_ce}%"),
                )
            )
        except ValueError:
            query = query.filter(models.Question.source_exam.like(f"%{year}%"))

    if part:
        p_str = str(part).strip().lower()
        if p_str in ["1", "2", "3", "4"]:
            # Match part 1, part_1, part1, etc.
            query = query.filter(
                or_(
                    models.Question.source_exam.ilike(f"%part_{p_str}%"),
                    models.Question.source_exam.ilike(f"%part {p_str}%"),
                    models.Question.source_exam.ilike(f"%part{p_str}%"),
                )
            )
        elif p_str == "law":
            query = query.filter(
                or_(
                    models.Question.category == "กฎหมายและจรรยาบรรณ",
                    models.Question.source_exam.ilike("%law%"),
                    models.Question.source_exam.ilike("%กฎหมาย%"),
                    models.Question.source_exam.ilike("%กฏหมาย%"),
                )
            )
        elif p_str == "day1":
            query = query.filter(
                or_(
                    models.Question.source_exam.ilike("%part_1%"),
                    models.Question.source_exam.ilike("%part 1%"),
                    models.Question.source_exam.ilike("%part1%"),
                    models.Question.source_exam.ilike("%part_2%"),
                    models.Question.source_exam.ilike("%part 2%"),
                    models.Question.source_exam.ilike("%part2%"),
                )
            )
        elif p_str == "day2":
            query = query.filter(
                or_(
                    models.Question.source_exam.ilike("%part_3%"),
                    models.Question.source_exam.ilike("%part 3%"),
                    models.Question.source_exam.ilike("%part3%"),
                    models.Question.source_exam.ilike("%part_4%"),
                    models.Question.source_exam.ilike("%part 4%"),
                    models.Question.source_exam.ilike("%part4%"),
                )
            )

    if ordered:
        # Pull all matching questions to sort in true exam order
        all_qs = query.all()
        
        def get_sort_key(q):
            exam_name = q.source_exam or ""
            # Extract part number, default to 99 if not found
            m = re.search(r'part[_\s]*(\d)', exam_name.lower())
            part_num = int(m.group(1)) if m else 99
            
            # Extract question number from question_text if available (e.g., "1.", "25.")
            q_num_match = re.search(r'^\s*(\d{1,3})\.', q.question_text or "")
            q_num = int(q_num_match.group(1)) if q_num_match else q.id
            
            # Extract year to keep years grouped if multiple years are queried
            year_match = re.search(r'(20\d{2}|25\d{2})', exam_name)
            year_num = int(year_match.group(1)) if year_match else 9999
            return (year_num, part_num, q_num, q.id)
            
        all_qs.sort(key=get_sort_key)
        base_questions = all_qs[:n]
    else:
        base_questions = query.order_by(func.random()).limit(n).all()

    stems = set()
    for q in base_questions:
        if q.stem and q.stem.strip() and q.stem.strip() != (q.question_text or "").strip():
            stems.add(q.stem)

    if stems:
        stem_questions = (
            query
            .filter(models.Question.stem.in_(stems))
            .all()
        )
        all_q_dict = {q.id: q for q in base_questions}
        for q in stem_questions:
            all_q_dict[q.id] = q
        combined_questions = list(all_q_dict.values())
    else:
        combined_questions = base_questions

    groups = {}
    for q in combined_questions:
        is_stem = q.stem and q.stem.strip() and q.stem.strip() != (q.question_text or "").strip()
        key = q.stem.strip() if is_stem else f"single_{q.id}"
        if key not in groups:
            groups[key] = []
        groups[key].append(q)

    for key in groups:
        groups[key].sort(key=lambda x: x.id)

    group_list = list(groups.values())
    if not ordered:
        random.shuffle(group_list)

    questions = []
    for g in group_list:
        questions.extend(g)

    return [_serialize_question(q) for q in questions]


# ── Auth‑gated endpoints (AI calls, mock generation, analysis, reports) ──

class ExplainRequest(BaseModel):
    question_id: int
    question_text: str
    choices: List[dict]
    category: str
    task: str


@app.post("/api/explain")
async def explain(
    req: ExplainRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return the correct answer + Thai explanation (requires auth)."""
    q = db.query(models.Question).filter(models.Question.id == req.question_id).first()
    if q is None:
        raise HTTPException(status_code=404, detail="Question not found")

    # Return cached if available
    if q.correct_answer and q.explanation:
        return {
            "question_id": q.id,
            "correct_answer": q.correct_answer,
            "explanation": q.explanation,
            "cached": True,
        }

    try:
        result = await explain_question_async(
            question_text=req.question_text,
            choices=[(c["label"], c["text"]) for c in req.choices],
            category=req.category,
            task=req.task,
        )
    except Exception as e:
        logger.exception("AI explanation failed for question %d", req.question_id)
        raise HTTPException(status_code=502, detail=f"AI explanation failed: {e}")

    # Backfill DB
    q.correct_answer = result.correct_answer
    detailed_explanation = {
        "core_principle": result.core_principle,
        "choice_explanations": result.choice_explanations,
        "future_prediction": getattr(result, 'future_prediction', '')
    }
    q.explanation = json.dumps(detailed_explanation, ensure_ascii=False)
    db.commit()

    return {
        "question_id": q.id,
        "correct_answer": result.correct_answer,
        "explanation": q.explanation,
        "cached": False,
    }


# ---- AI Predictor & Mock Test Generator ----
from generator import predict_trends_async, generate_mock_questions_async


@app.get("/api/prediction")
async def get_prediction(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Fetch database stats and generate an AI prediction report (requires auth)."""
    stats = (
        db.query(models.Question.category, models.Question.task, func.count(models.Question.id))
        .group_by(models.Question.category, models.Question.task)
        .all()
    )
    stats_text = ""
    for category, task, count in stats:
        stats_text += f"- {category} > {task}: {count} ข้อ\n"

    try:
        report = await predict_trends_async(stats_text)
        return {"report": report}
    except Exception as e:
        logger.exception("Prediction failed")
        raise HTTPException(status_code=502, detail=f"Prediction failed: {e}")


class MockGenerateRequest(BaseModel):
    category: str
    task: str
    count: int = 1


@app.post("/api/mock/generate", response_model=List[QuestionResponse])
async def generate_mock_exam(
    req: MockGenerateRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Generate new mock questions via AI (requires auth)."""
    examples = (
        db.query(models.Question)
        .filter(
            models.Question.category == req.category,
            models.Question.task == req.task,
        )
        .order_by(func.random())
        .limit(3)
        .all()
    )

    if not examples:
        # Fallback 1: match just the category
        examples = db.query(models.Question).filter(models.Question.category == req.category).order_by(func.random()).limit(3).all()
    if not examples:
        # Fallback 2: match just the task
        examples = db.query(models.Question).filter(models.Question.task == req.task).order_by(func.random()).limit(3).all()
    if not examples:
        # Fallback 3: any 3 questions for format
        examples = db.query(models.Question).order_by(func.random()).limit(3).all()
        
    if not examples:
        raise HTTPException(
            status_code=400,
            detail="Database is empty. Please upload some exams first.",
        )
    example_list = []
    for ex in examples:
        choices = db.query(models.Choice).filter(models.Choice.question_id == ex.id).all()
        example_list.append(
            {
                "question_text": ex.question_text,
                "choices": [{"label": c.label, "text": c.text} for c in choices],
                "correct_answer": ex.correct_answer or "1",
            }
        )

    try:
        generated_questions = await generate_mock_questions_async(
            category=req.category,
            task=req.task,
            count=req.count,
            examples=example_list,
        )
    except Exception as e:
        logger.exception("Mock generation failed")
        raise HTTPException(status_code=502, detail=f"Mock generation failed: {e}")

    saved_questions = []
    for gq in generated_questions:
        new_q = models.Question(
            question_text=gq.get("question_text", ""),
            stem=gq.get("stem"),
            proposition=gq.get("proposition"),
            category=req.category,
            task=req.task,
            correct_answer=gq.get("correct_answer"),
            explanation=gq.get("explanation"),
            source_exam="AI_MOCK_TEST",
        )
        db.add(new_q)
        db.commit()
        db.refresh(new_q)

        choices = []
        for c in gq.get("choices", []):
            new_choice = models.Choice(
                question_id=new_q.id,
                label=c.get("label"),
                text=c.get("text"),
            )
            db.add(new_choice)
            choices.append({"label": new_choice.label, "text": new_choice.text})

        db.commit()

        saved_questions.append(
            {
                "id": new_q.id,
                "question_text": new_q.question_text,
                "stem": new_q.stem,
                "proposition": new_q.proposition,
                "category": new_q.category,
                "task": new_q.task,
                "correct_answer": new_q.correct_answer,
                "explanation": new_q.explanation,
                "source_exam": new_q.source_exam,
                "image_path": new_q.image_path,
                "choices": choices,
            }
        )

    return saved_questions


# ---- Instant Post-Exam Analysis (requires auth) ----
class AnalysisRequest(BaseModel):
    question_ids: List[int]
    user_answers: dict


@app.post("/api/analysis")
def get_exam_analysis(
    req: AnalysisRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return instant analysis. Uses cached data only (requires auth)."""
    results = []
    category_stats = {}

    for qid in req.question_ids:
        q = db.query(models.Question).filter(models.Question.id == qid).first()
        if not q:
            continue

        user_ans = req.user_answers.get(str(qid)) or req.user_answers.get(qid)
        correct = q.correct_answer
        is_correct = bool(correct and user_ans and user_ans == correct)
        has_answer = bool(correct)

        cat = q.category or "ไม่ระบุ"
        if cat not in category_stats:
            category_stats[cat] = {"correct": 0, "total": 0, "has_answer": 0}
        category_stats[cat]["total"] += 1
        if has_answer:
            category_stats[cat]["has_answer"] += 1
        if is_correct:
            category_stats[cat]["correct"] += 1

        results.append(
            {
                "question_id": qid,
                "user_answer": user_ans,
                "correct_answer": correct,
                "is_correct": is_correct,
                "has_cached_answer": has_answer,
                "category": q.category,
                "task": q.task,
                "explanation": q.explanation,
            }
        )

    total_q = len(results)
    has_ans_q = sum(1 for r in results if r["has_cached_answer"])
    correct_count = sum(1 for r in results if r["is_correct"])
    wrong_count = sum(1 for r in results if r["has_cached_answer"] and not r["is_correct"])
    unanswered = sum(1 for r in results if not r["user_answer"])

    category_breakdown = []
    for cat, s in category_stats.items():
        pct = round(s["correct"] / s["has_answer"] * 100) if s["has_answer"] > 0 else None
        category_breakdown.append(
            {
                "category": cat,
                "correct": s["correct"],
                "total": s["total"],
                "has_answer": s["has_answer"],
                "percentage": pct,
            }
        )
    category_breakdown.sort(key=lambda x: (x["percentage"] is None, x["percentage"] or 0))

    return {
        "summary": {
            "total": total_q,
            "has_cached": has_ans_q,
            "correct": correct_count,
            "wrong": wrong_count,
            "unanswered": unanswered,
            "score_pct": round(correct_count / has_ans_q * 100) if has_ans_q > 0 else 0,
            "pass": (correct_count / has_ans_q * 100) >= 60 if has_ans_q > 0 else False,
        },
        "category_breakdown": category_breakdown,
        "per_question": results,
    }


@app.get("/api/cache-status")
def get_cache_status(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return cache coverage stats (requires auth)."""
    total = db.query(models.Question).count()
    has_ans = (
        db.query(models.Question)
        .filter(
            models.Question.correct_answer.isnot(None),
            models.Question.correct_answer != "",
        )
        .count()
    )
    has_expl = (
        db.query(models.Question)
        .filter(
            models.Question.explanation.isnot(None),
            models.Question.explanation != "",
        )
        .count()
    )
    full_cache = (
        db.query(models.Question)
        .filter(
            models.Question.correct_answer.isnot(None),
            models.Question.correct_answer != "",
            models.Question.explanation.isnot(None),
            models.Question.explanation != "",
        )
        .count()
    )
    return {
        "total": total,
        "has_answer": has_ans,
        "has_explanation": has_expl,
        "fully_cached": full_cache,
        "coverage_pct": round(full_cache / total * 100, 1) if total > 0 else 0,
    }


# Mount the static React frontend (must be last)
frontend_path = os.path.join(os.path.dirname(__file__), "frontend/dist")
if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)