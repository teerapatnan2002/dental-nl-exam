"""Concurrency-safe PDF -> parsed JSON -> SQLite importer for parallel subagents.

Each subagent:
  1. extracts text from one PDF (PyMuPDF)
  2. calls the LLM to categorize questions (ai_categorizer.categorize_pdf)
  3. writes <name>.json into parsed_exams/
  4. imports into exam_bank.db using a per-process engine with WAL + busy_timeout

SQLite is shared across subagents, so we use:
  - WAL journal mode (allows concurrent readers + one writer)
  - busy_timeout so writers queue instead of erroring with "database is locked"
  - commit in small batches
"""
import os
import sys
import json

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Question, Choice, Base

# WAL + busy_timeout keeps parallel writers from clobbering each other.
DB_URL = "sqlite:///./exam_bank.db"
_engine = create_engine(DB_URL, connect_args={"check_same_thread": False, "timeout": 60})
_Session = sessionmaker(bind=_engine)

# Ensure WAL mode is on (idempotent).
with _engine.begin() as conn:
    conn.exec_driver_sql("PRAGMA journal_mode=WAL;")
    conn.exec_driver_sql("PRAGMA busy_timeout=60000;")

def init_db():
    Base.metadata.create_all(bind=_engine)

def import_json(json_path: str):
    if not os.path.exists(json_path):
        raise FileNotFoundError(json_path)
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    questions = data.get("questions", [])
    db = _Session()
    count = 0
    try:
        for q in questions:
            db_q = Question(
                question_text=q["question_text"],
                correct_answer=q.get("correct_answer"),
                category=q["category"],
                task=q["task"],
                explanation=q.get("explanation"),
                source_exam=q.get("source_exam"),
            )
            db.add(db_q)
            db.flush()
            stem = q.get("stem")
            proposition = q.get("proposition")
            if stem is not None or proposition is not None:
                db_q.stem = stem
                db_q.proposition = proposition
            for c in q.get("choices", []):
                db.add(Choice(question_id=db_q.id, label=c["label"], text=c["text"]))
            count += 1
            if count % 20 == 0:
                db.commit()  # checkpoint periodically so other writers can proceed
        db.commit()
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()
    print(f"Imported {count} questions from {os.path.basename(json_path)}")


def run(pdf_path: str, out_dir: str = "parsed_exams"):
    from ai_categorizer import categorize_pdf
    init_db()
    os.makedirs(out_dir, exist_ok=True)
    source_exam = os.path.basename(pdf_path)
    out_json = os.path.join(out_dir, f"{source_exam}.json")
    if os.path.exists(out_json):
        print(f"SKIP {source_exam}: {out_json} already exists")
        return
    bank = categorize_pdf(pdf_path, source_exam)
    # Back-fill stem/proposition from question_text (split case vs sub-question).
    import re
    for q in bank.questions:
        qt = q.question_text or ""
        if q.stem and q.proposition:
            continue
        # Split on a newline followed by a numbered item like "1. " or "74. "
        mm = re.split(r"\n(?=\d{1,3}\.\s)", qt, maxsplit=1)
        if len(mm) == 2 and len(mm[0].strip()) > 15:
            q.stem = mm[0].strip()
            q.proposition = mm[1].strip()
        else:
            # fallback: split on "ข้อ N" marker
            mm2 = re.split(r"\n(?=ข้อ\s*\d{1,3})", qt, maxsplit=1)
            if len(mm2) == 2 and len(mm2[0].strip()) > 15:
                q.stem = mm2[0].strip()
                q.proposition = mm2[1].strip()
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(bank.model_dump(), f, ensure_ascii=False, indent=2)
    print(f"Wrote {len(bank.questions)} questions -> {out_json}")
    import_json(out_json)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 import_pdf_safe.py <pdf_path>")
        sys.exit(1)
    run(sys.argv[1])
