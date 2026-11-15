import os
import re
import json
import random
import logging
from datetime import datetime, timezone, timedelta
from typing import List, Optional

from tos_blueprint import (
    MOCK_70_OPEN_TIME,
    TOS_CATEGORIES,
    TOS_COGNITIVE,
    TOS_TASKS,
    TZ_BKK,
    is_mock_70_locked,
)


from fastapi import FastAPI, Depends, HTTPException, Query, Request
from fastapi.responses import FileResponse
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session, selectinload
from sqlalchemy.sql.expression import func
from sqlalchemy import or_, text
from pydantic import BaseModel, Field

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
try:
    Base.metadata.create_all(bind=engine)
    run_migrations()
    run_fts_migration()
except Exception as e:
    logger.warning("Startup DB migration deferred: %s", e)

_is_prod = bool(os.environ.get("VERCEL") or os.environ.get("ENV") == "production")
app = FastAPI(
    title="Dental Exam API",
    docs_url=None if _is_prod else "/docs",
    redoc_url=None if _is_prod else "/redoc",
    openapi_url=None if _is_prod else "/openapi.json",
)


@app.get("/api/health")
@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ok", "service": "Dental Exam API", "database": "connected"}
    except Exception as e:
        logger.warning("Health check database probe failed: %s", e)
        return {"status": "degraded", "service": "Dental Exam API", "database": "unavailable"}


# ── Import routers ──
from auth import (
    router as auth_router,
    get_current_user,
    get_optional_current_user,
    _check_rate_limit,
    _get_client_ip,
)
from tracking import router as tracking_router
from tutor import router as tutor_router
from reports import router as reports_router
from bookmarks import router as bookmarks_router
from learning import router as learning_router
from presence import router as presence_router

app.include_router(auth_router)
app.include_router(tracking_router)
app.include_router(tutor_router)
app.include_router(reports_router)
app.include_router(bookmarks_router)
app.include_router(learning_router)
app.include_router(presence_router)

# ── CORS: read allowed origins from env, reject wildcard '*' when credentials=True ──
_allowed_origins_env = os.environ.get("ALLOWED_ORIGINS", "")
_parsed_origins = [o.strip() for o in _allowed_origins_env.split(",") if o.strip()]
if "*" in _parsed_origins:
    logger.warning("Ignoring wildcard '*' in ALLOWED_ORIGINS because allow_credentials=True")
allowed_origins = [o for o in _parsed_origins if o != "*"]
if not allowed_origins:
    if _is_prod:
        allowed_origins = [
            "https://dental-nl-exam.vercel.app",
            "https://dental-nl-exam-teerapat5.vercel.app",
            "https://dental-nl-exam-git-main-teerapat5.vercel.app",
        ]
    else:
        allowed_origins = ["http://localhost:5173", "http://localhost:8000", "http://127.0.0.1:5173", "http://127.0.0.1:8000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Requested-With"],
)

# ── Security Headers Middleware ──


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    response.headers["Cross-Origin-Opener-Policy"] = "same-origin"
    response.headers["X-Permitted-Cross-Domain-Policies"] = "none"
    response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains; preload"
    response.headers["Content-Security-Policy"] = "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'"
    response.headers["Content-Security-Policy-Report-Only"] = (
        "default-src 'self'; "
        "script-src 'self' https://va.vercel-scripts.com; "
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
        "font-src 'self' https://fonts.gstatic.com data:; "
        "img-src 'self' data: blob: https://upload.wikimedia.org https://*.wikimedia.org; "
        "connect-src 'self' https://*.vercel-insights.com https://vitals.vercel-insights.com https://va.vercel-scripts.com; "
        "object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
    )
    if request.url.path.startswith("/api/"):
        response.headers["Cache-Control"] = "no-store, max-age=0"
    elif request.url.path.startswith("/assets/") and response.status_code == 200:
        response.headers["Cache-Control"] = "public, max-age=31536000, immutable"
    return response

# GZip middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Serve static images
try:
    os.makedirs("images", exist_ok=True)
    app.mount("/images", StaticFiles(directory="images"), name="images")
except Exception as e:
    logger.warning("Could not mount /images: %s", e)


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
    exam_origin: Optional[str] = "real_exam"
    image_path: Optional[str] = None
    cognitive_level: Optional[str] = None
    must_know_topic: Optional[str] = None
    choices: List[dict] = []

    class Config:
        from_attributes = True


def _serialize_question(q: models.Question, include_answers: bool = False) -> dict:
    """Serialize a Question ORM object. Expects `choices` to be eager-loaded
    via selectinload to avoid N+1 queries. Answers are withheld before submission
    unless `include_answers=True`."""
    choices = [{"label": c.label, "text": c.text} for c in q.choices]
    return {
        "id": q.id,
        "question_text": q.question_text,
        "stem": q.stem,
        "proposition": q.proposition,
        "category": q.category,
        "task": q.task,
        "correct_answer": q.correct_answer if include_answers else None,
        "explanation": q.explanation if include_answers else None,
        "source_exam": q.source_exam,
        "exam_origin": getattr(q, "exam_origin", None) or "real_exam",
        "image_path": q.image_path,
        "cognitive_level": q.cognitive_level,
        "must_know_topic": q.must_know_topic,
        "choices": choices,
    }


# ── Public endpoints (no auth required) ──

@app.get("/api/categories")
def get_categories():
    clinical_tasks = [
        ProfessionalTask.HEALTH_PROMOTION_AND_PREVENTION.value,
        ProfessionalTask.MECHANISM_OF_DISEASES.value,
        ProfessionalTask.DATA_GATHERING_AND_DIAGNOSIS.value,
        ProfessionalTask.PATIENT_MANAGEMENT_AND_TREATMENT.value,
        ProfessionalTask.PROCEDURES.value,
    ]
    law_tasks = [
        ProfessionalTask.LAW_ACT.value,
        ProfessionalTask.LAW_ETHICS.value,
        ProfessionalTask.LAW_CLINIC.value,
        ProfessionalTask.LAW_OTHER.value,
    ]
    return {
        "categories": [c.value for c in ClinicalCategory],
        "tasks": [t.value for t in ProfessionalTask],
        "clinical_tasks": clinical_tasks,
        "law_tasks": law_tasks,
    }


@app.get("/api/stats")
def get_stats(db: Session = Depends(get_db)):
    real_filter = (models.Question.exam_origin == "real_exam")
    cat_stats = (
        db.query(models.Question.category, func.count(models.Question.id))
        .filter(real_filter)
        .group_by(models.Question.category)
        .all()
    )
    task_stats = (
        db.query(models.Question.task, func.count(models.Question.id))
        .filter(real_filter)
        .group_by(models.Question.task)
        .all()
    )
    # Breakdown of tasks per category (Real NL Exams only)
    cat_task_rows = (
        db.query(models.Question.category, models.Question.task, func.count(models.Question.id))
        .filter(real_filter)
        .group_by(models.Question.category, models.Question.task)
        .all()
    )
    category_tasks = {}
    for cat, task, count in cat_task_rows:
        if not cat:
            continue
        if cat not in category_tasks:
            category_tasks[cat] = []
        if task:
            category_tasks[cat].append({"task": task, "count": count})

    for cat in category_tasks:
        category_tasks[cat].sort(key=lambda x: x["count"], reverse=True)

    # Separated summary of Mock sets (excluded from Real Exam stats)
    mock_rows = (
        db.query(
            models.Question.exam_origin,
            models.Question.source_exam,
            models.Question.category,
            func.count(models.Question.id),
        )
        .filter(models.Question.exam_origin.in_(["dsat_mock", "ai_mock"]))
        .group_by(models.Question.exam_origin, models.Question.source_exam, models.Question.category)
        .all()
    )
    dsat_total = 0
    ai_total = 0
    mock_sets_map = {}
    for origin, src, cat, cnt in mock_rows:
        if origin == "dsat_mock":
            dsat_total += cnt
        else:
            ai_total += cnt
        key = (origin, src or "")
        entry = mock_sets_map.setdefault(
            key,
            {
                "source_exam": src or "",
                "exam_origin": origin,
                "is_law": cat == "กฎหมายและจรรยาบรรณ",
                "count": 0,
            },
        )
        entry["count"] += cnt

    mock_sets = sorted(
        mock_sets_map.values(),
        key=lambda x: (0 if x["exam_origin"] == "dsat_mock" else 1, x["source_exam"]),
    )

    return {
        "categories": [{"category": c, "count": count} for c, count in cat_stats],
        "tasks": [{"task": t, "count": count} for t, count in task_stats],
        "category_tasks": category_tasks,
        "mock_summary": {
            "total_mock": dsat_total + ai_total,
            "dsat_mock_total": dsat_total,
            "ai_mock_total": ai_total,
            "sets": mock_sets,
        },
    }


@app.get("/api/analytics/my-readiness")
def get_analytics_my_readiness(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    from tracking import compute_user_readiness

    return compute_user_readiness(current_user, db)


@app.get("/api/analytics/tos")
def get_tos_analytics(db: Session = Depends(get_db)):
    tos_categories = TOS_CATEGORIES
    tos_tasks = TOS_TASKS
    tos_cognitive = TOS_COGNITIVE

    all_q = (
        db.query(
            models.Question.id,
            models.Question.category,
            models.Question.task,
            models.Question.cognitive_level,
            models.Question.must_know_topic,
        )
        .filter(models.Question.exam_origin == "real_exam")
        .all()
    )
    total_q = len(all_q)
    clinical_q = [q for q in all_q if q.category != "กฎหมายและจรรยาบรรณ"]
    clinical_total = len(clinical_q)

    cat_counts = {}
    for q in all_q:
        cat_counts[q.category] = cat_counts.get(q.category, 0) + 1

    categories_res = []
    for tc in tos_categories:
        cat_name = tc["category"]
        actual_cnt = cat_counts.get(cat_name, 0)
        base_tot = clinical_total if cat_name != "กฎหมายและจรรยาบรรณ" else total_q
        actual_pct = round((actual_cnt / base_tot * 100), 1) if base_tot else 0
        diff = round(actual_pct - tc["target_pct"], 1)
        categories_res.append({
            "category": cat_name,
            "target_count": tc["target_count"],
            "target_pct": tc["target_pct"],
            "actual_count": actual_cnt,
            "actual_pct": actual_pct,
            "diff_pct": diff,
            "status": "High" if diff > 2.0 else ("Low" if diff < -2.0 else "Balanced")
        })

    task_counts = {}
    for q in clinical_q:
        task_counts[q.task] = task_counts.get(q.task, 0) + 1

    tasks_res = []
    for tt in tos_tasks:
        t_name = tt["task"]
        actual_cnt = task_counts.get(t_name, 0)
        actual_pct = round((actual_cnt / clinical_total * 100), 1) if clinical_total else 0
        diff = round(actual_pct - tt["target_pct"], 1)
        tasks_res.append({
            "task": t_name,
            "target_count": tt["target_count"],
            "target_pct": tt["target_pct"],
            "actual_count": actual_cnt,
            "actual_pct": actual_pct,
            "diff_pct": diff,
            "status": "High" if diff > 3.0 else ("Low" if diff < -3.0 else "Balanced")
        })

    cog_counts = {}
    for q in all_q:
        cog = q.cognitive_level or "A"
        cog_counts[cog] = cog_counts.get(cog, 0) + 1

    cognitive_res = []
    for cog_item in tos_cognitive:
        lvl = cog_item["level"]
        actual_cnt = cog_counts.get(lvl, 0)
        actual_pct = round((actual_cnt / total_q * 100), 1) if total_q else 0
        diff = round(actual_pct - cog_item["target_pct"], 1)
        cognitive_res.append({
            "level": lvl,
            "name": cog_item["name"],
            "target_count": cog_item["target_count"],
            "target_pct": cog_item["target_pct"],
            "actual_count": actual_cnt,
            "actual_pct": actual_pct,
            "diff_pct": diff,
        })

    matrix_cat_task = {}
    matrix_cat_cog = {}
    for q in all_q:
        cat = q.category or "Unknown"
        task = q.task or "Unknown"
        cog = q.cognitive_level or "A"
        if cat not in matrix_cat_task:
            matrix_cat_task[cat] = {}
        matrix_cat_task[cat][task] = matrix_cat_task[cat].get(task, 0) + 1
        
        if cat not in matrix_cat_cog:
            matrix_cat_cog[cat] = {}
        matrix_cat_cog[cat][cog] = matrix_cat_cog[cat].get(cog, 0) + 1

    topic_counts = {}
    topics_by_cat = {}
    for q in all_q:
        t = q.must_know_topic
        if not t:
            continue
        topic_counts[t] = topic_counts.get(t, 0) + 1
        cat = q.category
        if cat not in topics_by_cat:
            topics_by_cat[cat] = {}
        topics_by_cat[cat][t] = topics_by_cat[cat].get(t, 0) + 1

    top_topics = [
        {"topic": t, "count": cnt}
        for t, cnt in sorted(topic_counts.items(), key=lambda x: -x[1])[:20]
    ]

    return {
        "summary": {
            "total_questions": total_q,
            "clinical_questions": clinical_total,
            "law_questions": len(all_q) - clinical_total,
            "total_must_know_topics": len(topic_counts),
        },
        "categories": categories_res,
        "tasks": tasks_res,
        "cognitive": cognitive_res,
        "heatmap_matrix": matrix_cat_task,
        "cognitive_matrix": matrix_cat_cog,
        "top_topics": top_topics,
        "topics_by_category": {
            cat: [{"topic": t, "count": c} for t, c in sorted(t_dict.items(), key=lambda x: -x[1])]
            for cat, t_dict in topics_by_cat.items()
        }
    }


@app.get("/api/years")
def get_years(db: Session = Depends(get_db)):
    questions = (
        db.query(
            models.Question.id,
            models.Question.source_exam,
            models.Question.category,
            models.Question.task,
            models.Question.stem,
            models.Question.question_text,
        )
        .filter(models.Question.exam_origin == "real_exam")
        .all()
    )

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
    request: Request,
    category: Optional[str] = None,
    task: Optional[str] = None,
    exam_origin: Optional[str] = "real_exam",
    skip: int = Query(0, ge=0, le=5000),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    _check_rate_limit(f"q-list:{_get_client_ip(request)}", max_attempts=30, window_seconds=300)
    query = db.query(models.Question).options(selectinload(models.Question.choices))
    if exam_origin == "mock":
        query = query.filter(models.Question.exam_origin.in_(["dsat_mock", "ai_mock"]))
    elif exam_origin == "all":
        query = query.filter(models.Question.exam_origin != "duplicate_archive")
    elif exam_origin:
        query = query.filter(models.Question.exam_origin == exam_origin)
    else:
        query = query.filter(models.Question.exam_origin == "real_exam")

    if category:
        query = query.filter(models.Question.category == category)
    if task:
        query = query.filter(models.Question.task == task)

    if is_mock_70_locked():
        query = query.filter(~models.Question.source_exam.like("%2570%"))

    questions = query.offset(skip).limit(limit).all()
    return [_serialize_question(q, include_answers=False) for q in questions]


class QuestionIdsRequest(BaseModel):
    question_ids: List[int] = Field(..., max_length=100)


@app.post("/api/questions/by-ids", response_model=List[QuestionResponse])
def get_questions_by_ids(
    payload: QuestionIdsRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    _check_rate_limit(f"q-byids:{_get_client_ip(request)}", max_attempts=60, window_seconds=300)
    requested = [int(qid) for qid in payload.question_ids[:100]]
    if not requested:
        return []
    query = (
        db.query(models.Question)
        .options(selectinload(models.Question.choices))
        .filter(models.Question.id.in_(requested))
    )
    if is_mock_70_locked():
        query = query.filter(~models.Question.source_exam.like("%2570%"))
    q_map = {q.id: q for q in query.all()}
    return [_serialize_question(q_map[qid], include_answers=False) for qid in requested if qid in q_map]


@app.get("/api/search", response_model=List[QuestionResponse])
def search_questions(
    request: Request,
    q: str = Query(..., min_length=2, max_length=200),
    category: Optional[str] = None,
    limit: int = Query(30, gt=0, le=100),
    db: Session = Depends(get_db),
):
    """Full-text search over real exam question text/stem/proposition via SQLite FTS5.
    Falls back to LIKE matching if the FTS table is unavailable (e.g. Postgres)."""
    _check_rate_limit(f"q-search:{_get_client_ip(request)}", max_attempts=60, window_seconds=300)
    fts_available = None
    is_sqlite = bool(db.bind and db.bind.dialect.name == "sqlite")
    if is_sqlite:
        try:
            fts_available = db.execute(
                text("SELECT name FROM sqlite_master WHERE type='table' AND name='questions_fts'")
            ).first()
        except Exception:
            db.rollback()
            fts_available = None

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
            {"match": safe_q, "lim": min(limit * 3, 300)},
        ).fetchall()
        question_ids = [r[0] for r in rows]

    query = (
        db.query(models.Question)
        .options(selectinload(models.Question.choices))
        .filter(models.Question.exam_origin == "real_exam")
    )
    if is_mock_70_locked():
        query = query.filter(~models.Question.source_exam.like("%2570%"))

    if question_ids:
        query = query.filter(models.Question.id.in_(question_ids))
    elif not use_fts:
        like = f"%{q}%"
        query = query.filter(
            or_(
                models.Question.question_text.ilike(like),
                models.Question.stem.ilike(like),
                models.Question.proposition.ilike(like),
            )
        )
    else:
        return []  # FTS available but no matches

    if category:
        query = query.filter(models.Question.category == category)

    questions = query.limit(limit).all()
    return [_serialize_question(qs, include_answers=False) for qs in questions]


@app.get("/api/exam/random", response_model=List[QuestionResponse])
def generate_random_exam(
    request: Request,
    n: int = Query(10, gt=0, le=500),
    category: Optional[str] = None,
    task: Optional[str] = None,
    must_know_topic: Optional[str] = None,
    year: Optional[str] = None,
    part: Optional[str] = None,
    source_exam: Optional[str] = None,
    exam_origin: Optional[str] = None,
    include_mock: bool = False,
    ordered: bool = False,
    clinical_only: bool = False,
    db: Session = Depends(get_db),
):
    _check_rate_limit(f"exam-rand:{_get_client_ip(request)}", max_attempts=40, window_seconds=300)
    query = (
        db.query(models.Question)
        .options(selectinload(models.Question.choices))
        .filter(models.Question.exam_origin != "duplicate_archive")
    )

    # Strictly separate Mock sets from Real National License questions unless explicitly requested
    src_lower = (source_exam or "").lower()
    is_explicit_mock_source = any(kw in src_lower for kw in ("mock", "dsat", "ai_mock"))
    if exam_origin:
        origin_norm = exam_origin.strip().lower()
        if origin_norm == "mock":
            query = query.filter(models.Question.exam_origin.in_(["dsat_mock", "ai_mock"]))
        elif origin_norm == "all":
            pass
        else:
            query = query.filter(models.Question.exam_origin == origin_norm)
    elif include_mock or is_explicit_mock_source:
        if is_explicit_mock_source:
            query = query.filter(models.Question.exam_origin.in_(["dsat_mock", "ai_mock"]))
    else:
        query = query.filter(models.Question.exam_origin == "real_exam")
    if category:
        query = query.filter(models.Question.category == category)
    if must_know_topic:
        query = query.filter(models.Question.must_know_topic == must_know_topic)
    if clinical_only:
        query = query.filter(models.Question.category != "กฎหมายและจรรยาบรรณ")
    if task:
        query = query.filter(models.Question.task == task)
    if source_exam:
        query = query.filter(models.Question.source_exam.ilike(f"%{source_exam}%"))
    if year:
        try:
            y_raw = str(year).strip()
            y_val = int(y_raw)
            # Support 2-digit Thai BE (e.g. 63 -> 2563, 65 -> 2565, 66 -> 2566)
            if 50 <= y_val <= 99:
                y_be = 2500 + y_val
                y_ce = y_be - 543
            # Support 2-digit CE (e.g. 20 -> 2020, 22 -> 2022)
            elif 0 <= y_val < 50:
                y_ce = 2000 + y_val
                y_be = y_ce + 543
            # Support 4-digit CE (e.g. 2020 to 2030)
            elif 1900 <= y_val <= 2100:
                y_ce = y_val
                y_be = y_val + 543
            # Support 4-digit BE (e.g. 2560 to 2575)
            elif y_val >= 2400:
                y_be = y_val
                y_ce = y_val - 543
            else:
                y_be = y_val
                y_ce = y_val - 543

            if is_mock_70_locked() and (y_be == 2570 or y_val == 70 or y_ce == 2027):
                raise HTTPException(
                    status_code=403,
                    detail="ห้องสอบ Mock 70 ถูกล็อคตามกำหนดการ ระบบจะเปิดสอบพร้อมกันในวันเสาร์ที่ 26 กันยายน 2569 เวลา 13:00 น. ไม่มีการเปิดสอบหรือฝึกทำล่วงหน้า"
                )

            query = query.filter(
                or_(
                    models.Question.source_exam.like(f"%{y_be}%"),
                    models.Question.source_exam.like(f"%{y_ce}%"),
                    models.Question.source_exam.like(f"%{y_val}%"),
                )
            )
        except HTTPException:
            raise
        except (ValueError, TypeError):
            if is_mock_70_locked() and "2570" in str(year):
                raise HTTPException(
                    status_code=403,
                    detail="ห้องสอบ Mock 70 ถูกล็อคตามกำหนดการ ระบบจะเปิดสอบพร้อมกันในวันเสาร์ที่ 26 กันยายน 2569 เวลา 13:00 น. ไม่มีการเปิดสอบหรือฝึกทำล่วงหน้า"
                )
            query = query.filter(models.Question.source_exam.like(f"%{year}%"))
    else:
        # Exclude locked Mock 70 questions from general randomized queries before opening
        if is_mock_70_locked():
            query = query.filter(~models.Question.source_exam.like("%2570%"))

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

    if ordered:
        # Pull all matching questions to sort in true exam order
        all_qs = query.all()
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
    else:
        group_list.sort(key=lambda g: get_sort_key(g[0]))

    questions = []
    for g in group_list:
        questions.extend(g)

    return [_serialize_question(q, include_answers=False) for q in questions]


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
    request: Request,
    current_user: Optional[models.User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
):
    """Return the correct answer + Thai explanation. Cached DB explanations allow
    rate-limited practice reveal; uncached AI generation requires authentication."""
    q = db.query(models.Question).filter(models.Question.id == req.question_id).first()
    if q is None:
        raise HTTPException(status_code=404, detail="Question not found")
    if is_mock_70_locked() and q.source_exam and "2570" in q.source_exam:
        raise HTTPException(status_code=403, detail="Mock 2570 exam question is locked")

    client_ip = _get_client_ip(request)
    # Return cached if available (rate-limited to prevent bulk answer harvesting)
    if q.correct_answer and q.explanation:
        if current_user is not None:
            _check_rate_limit(f"explain-cached-u:{current_user.id}", max_attempts=120, window_seconds=300)
        else:
            _check_rate_limit(f"explain-cached-ip:{client_ip}", max_attempts=40, window_seconds=300)
        return {
            "question_id": q.id,
            "correct_answer": q.correct_answer,
            "explanation": q.explanation,
            "cached": True,
        }

    if current_user is None:
        raise HTTPException(
            status_code=401,
            detail="กรุณาเข้าสู่ระบบเพื่อใช้ AI สร้างคำอธิบายสำหรับข้อนี้",
        )

    _check_rate_limit(f"ai-explain:{current_user.id}", max_attempts=20, window_seconds=300)

    try:
        result = await explain_question_async(
            question_text=req.question_text,
            choices=[(c["label"], c["text"]) for c in req.choices],
            category=req.category,
            task=req.task,
        )
    except Exception:
        logger.exception("AI explanation failed for question %d", req.question_id)
        raise HTTPException(status_code=502, detail="ไม่สามารถสร้างคำอธิบายด้วย AI ได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง")

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
    _check_rate_limit(f"ai-prediction:{current_user.id}", max_attempts=10, window_seconds=300)
    stats = (
        db.query(models.Question.category, models.Question.task, func.count(models.Question.id))
        .filter(models.Question.exam_origin == "real_exam")
        .group_by(models.Question.category, models.Question.task)
        .all()
    )
    stats_text = ""
    for category, task, count in stats:
        stats_text += f"- {category} > {task}: {count} ข้อ\n"

    try:
        report = await predict_trends_async(stats_text)
        return {"report": report}
    except Exception:
        logger.exception("Prediction failed")
        raise HTTPException(status_code=502, detail="ไม่สามารถสร้างรายงานวิเคราะห์แนวโน้มได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง")


class MockGenerateRequest(BaseModel):
    category: str = Field(..., max_length=200)
    task: str = Field(..., max_length=200)
    count: int = Field(default=1, ge=1, le=10)


@app.post("/api/mock/generate", response_model=List[QuestionResponse])
async def generate_mock_exam(
    req: MockGenerateRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _check_rate_limit(f"ai-mock:{current_user.id}", max_attempts=10, window_seconds=300)
    """Generate new mock questions via AI (requires auth)."""
    examples = (
        db.query(models.Question)
        .filter(
            models.Question.exam_origin == "real_exam",
            models.Question.category == req.category,
            models.Question.task == req.task,
        )
        .order_by(func.random())
        .limit(3)
        .all()
    )

    if not examples:
        # Fallback 1: match just the category
        examples = (
            db.query(models.Question)
            .filter(models.Question.exam_origin == "real_exam", models.Question.category == req.category)
            .order_by(func.random())
            .limit(3)
            .all()
        )
    if not examples:
        # Fallback 2: match just the task
        examples = (
            db.query(models.Question)
            .filter(models.Question.exam_origin == "real_exam", models.Question.task == req.task)
            .order_by(func.random())
            .limit(3)
            .all()
        )
    if not examples:
        # Fallback 3: any 3 questions for format
        examples = (
            db.query(models.Question)
            .filter(models.Question.exam_origin == "real_exam")
            .order_by(func.random())
            .limit(3)
            .all()
        )
        
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
    except Exception:
        logger.exception("Mock generation failed")
        raise HTTPException(status_code=502, detail="ไม่สามารถสร้างข้อสอบจำลองด้วย AI ได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง")

    is_admin_user = getattr(current_user, "role", "user") == "admin"
    saved_questions = []
    for idx, gq in enumerate(generated_questions, start=1):
        if is_admin_user:
            new_q = models.Question(
                question_text=gq.get("question_text", ""),
                stem=gq.get("stem"),
                proposition=gq.get("proposition"),
                category=req.category,
                task=req.task,
                correct_answer=gq.get("correct_answer"),
                explanation=gq.get("explanation"),
                source_exam="AI_MOCK_TEST",
                exam_origin="ai_mock",
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
                    "exam_origin": "ai_mock",
                    "image_path": new_q.image_path,
                    "choices": choices,
                }
            )
        else:
            choices = [
                {"label": str(c.get("label", "")), "text": str(c.get("text", ""))}
                for c in gq.get("choices", [])
            ]
            saved_questions.append(
                {
                    "id": -idx,
                    "question_text": gq.get("question_text", ""),
                    "stem": gq.get("stem"),
                    "proposition": gq.get("proposition"),
                    "category": req.category,
                    "task": req.task,
                    "correct_answer": gq.get("correct_answer"),
                    "explanation": gq.get("explanation"),
                    "source_exam": "AI_MOCK_TEST",
                    "exam_origin": "ai_mock",
                    "image_path": None,
                    "choices": choices,
                }
            )

    return saved_questions


# ---- Instant Post-Exam Analysis (cached answers only, supports logged-in & free guest mode) ----
class AnalysisRequest(BaseModel):
    question_ids: List[int] = Field(..., max_length=500)
    user_answers: dict


@app.post("/api/analysis")
def get_exam_analysis(
    req: AnalysisRequest,
    request: Request,
    current_user: Optional[models.User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
):
    """Return instant post-submission analysis using cached DB answers only."""
    if current_user is not None:
        _check_rate_limit(f"analysis-u:{current_user.id}", max_attempts=60, window_seconds=300)
    else:
        _check_rate_limit(f"analysis-ip:{_get_client_ip(request)}", max_attempts=25, window_seconds=300)

    requested_ids = [int(qid) for qid in (req.question_ids or [])[:500] if int(qid) > 0]
    unique_ids = list(dict.fromkeys(requested_ids))
    q_map: dict[int, models.Question] = {}
    if unique_ids:
        db_qs = (
            db.query(models.Question)
            .filter(
                models.Question.id.in_(unique_ids),
                models.Question.exam_origin != "duplicate_archive",
            )
            .all()
        )
        locked = is_mock_70_locked()
        for item in db_qs:
            if locked and item.source_exam and "2570" in item.source_exam:
                continue
            q_map[item.id] = item

    results = []
    category_stats = {}

    for qid in unique_ids:
        q = q_map.get(qid)
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

        from learning import get_topic_meta
        t_meta = get_topic_meta(q.must_know_topic or "", q.category or "") if q.must_know_topic else None
        results.append(
            {
                "question_id": qid,
                "user_answer": user_ans,
                "correct_answer": correct,
                "is_correct": is_correct,
                "has_cached_answer": has_answer,
                "category": q.category,
                "task": q.task,
                "cognitive_level": q.cognitive_level,
                "must_know_topic": q.must_know_topic,
                "must_know_topic_th": t_meta["title_th"] if t_meta else None,
                "source_exam": q.source_exam,
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
    """Return cache coverage stats for Real NL Exam bank (requires auth)."""
    real_q = db.query(models.Question).filter(models.Question.exam_origin == "real_exam")
    total = real_q.count()
    has_ans = real_q.filter(
        models.Question.correct_answer.isnot(None),
        models.Question.correct_answer != "",
    ).count()
    has_expl = real_q.filter(
        models.Question.explanation.isnot(None),
        models.Question.explanation != "",
    ).count()
    full_cache = real_q.filter(
        models.Question.correct_answer.isnot(None),
        models.Question.correct_answer != "",
        models.Question.explanation.isnot(None),
        models.Question.explanation != "",
    ).count()
    return {
        "total": total,
        "has_answer": has_ans,
        "has_explanation": has_expl,
        "fully_cached": full_cache,
        "coverage_pct": round(full_cache / total * 100, 1) if total > 0 else 0,
    }

# ── Serve static React frontend and SPA fallback ──
frontend_path = os.path.join(os.path.dirname(__file__), "frontend/dist")
if os.path.exists(frontend_path):
    assets_path = os.path.join(frontend_path, "assets")
    if os.path.exists(assets_path):
        app.mount("/assets", StaticFiles(directory=assets_path), name="assets")

    @app.api_route("/{full_path:path}", methods=["GET", "HEAD"])
    async def serve_spa(full_path: str):
        # Do not intercept API, Vercel telemetry, or missing static asset paths with index.html
        if full_path.startswith(("api", "_vercel/", "assets/")):
            raise HTTPException(status_code=404, detail="Not found")

        # Serve static file if it directly exists inside frontend/dist (guard against path traversal)
        real_root = os.path.realpath(frontend_path)
        if full_path:
            real_target = os.path.realpath(os.path.join(real_root, full_path))
            if real_target.startswith(real_root + os.sep) and os.path.isfile(real_target):
                return FileResponse(real_target)

        # Fallback to index.html for React SPA client-side routing (never cache stale entry HTML)
        index_file = os.path.join(real_root, "index.html")
        if os.path.exists(index_file):
            return FileResponse(
                index_file,
                headers={
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    "Pragma": "no-cache",
                },
            )
        raise HTTPException(status_code=404, detail="index.html not found")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)