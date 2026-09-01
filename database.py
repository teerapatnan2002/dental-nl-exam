import logging
import os
from dotenv import load_dotenv

load_dotenv()

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker

logger = logging.getLogger(__name__)

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/exam_bank.db")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency that yields a database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ── Lightweight SQLite column migrations ──
# `Base.metadata.create_all()` only creates *missing tables*, never adds
# *missing columns* to existing tables. These declarations keep old
# databases up to date without requiring Alembic for now.
_COLUMN_MIGRATIONS = {
    # table_name: {column_name: DDL for ALTER TABLE ADD COLUMN}
    "users": {
        "role": "ALTER TABLE users ADD COLUMN role VARCHAR NOT NULL DEFAULT 'user'",
    },
    "exam_sessions": {
        "time_limit_seconds": "ALTER TABLE exam_sessions ADD COLUMN time_limit_seconds INTEGER",
        "time_spent_seconds": "ALTER TABLE exam_sessions ADD COLUMN time_spent_seconds INTEGER",
    },
    "user_answers": {
        "time_spent_seconds": "ALTER TABLE user_answers ADD COLUMN time_spent_seconds INTEGER",
    },
    "reported_questions": {
        "admin_reply": "ALTER TABLE reported_questions ADD COLUMN admin_reply VARCHAR",
    },
}


def run_migrations():
    """Add missing columns to existing tables (SQLite-safe, idempotent)."""
    inspector = inspect(engine)
    existing_tables = set(inspector.get_table_names())

    with engine.begin() as conn:
        for table, columns in _COLUMN_MIGRATIONS.items():
            if table not in existing_tables:
                continue  # table will be created fresh by create_all
            existing_cols = {c["name"] for c in inspector.get_columns(table)}
            for col, ddl in columns.items():
                if col not in existing_cols:
                    logger.info("Migration: adding column %s.%s", table, col)
                    conn.execute(text(ddl))


def run_fts_migration():
    """Create an FTS5 virtual table for full-text question search (SQLite only).

    Uses the `trigram` tokenizer so that substring matching works for Thai
    text. Requires SQLite >= 3.34.
    """
    if not SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
        return
    try:
        with engine.begin() as conn:
            # If an old (non-trigram) FTS table exists, drop it so we can rebuild
            existing = conn.execute(
                text(
                    "SELECT sql FROM sqlite_master WHERE type='table' AND name='questions_fts'"
                )
            ).first()
            if existing and "trigram" not in (existing[0] or ""):
                logger.info("Migration: rebuilding questions_fts with trigram tokenizer")
                conn.execute(text("DROP TABLE questions_fts"))
                existing = None

            conn.execute(
                text(
                    """
                    CREATE VIRTUAL TABLE IF NOT EXISTS questions_fts
                    USING fts5(
                        question_text,
                        stem,
                        proposition,
                        category,
                        task,
                        content='questions',
                        content_rowid='id',
                        tokenize='trigram'
                    )
                    """
                )
            )
            # Backfill any questions not yet indexed
            conn.execute(
                text(
                    """
                    INSERT INTO questions_fts(rowid, question_text, stem, proposition, category, task)
                    SELECT id, question_text, IFNULL(stem,''), IFNULL(proposition,''), category, task
                    FROM questions
                    WHERE id NOT IN (SELECT rowid FROM questions_fts)
                    """
                )
            )
            # Keep the FTS index in sync automatically on future writes
            conn.execute(
                text(
                    """
                    CREATE TRIGGER IF NOT EXISTS questions_fts_ai AFTER INSERT ON questions BEGIN
                        INSERT INTO questions_fts(rowid, question_text, stem, proposition, category, task)
                        VALUES (new.id, new.question_text, IFNULL(new.stem,''), IFNULL(new.proposition,''), new.category, new.task);
                    END
                    """
                )
            )
            conn.execute(
                text(
                    """
                    CREATE TRIGGER IF NOT EXISTS questions_fts_ad AFTER DELETE ON questions BEGIN
                        INSERT INTO questions_fts(questions_fts, rowid, question_text, stem, proposition, category, task)
                        VALUES ('delete', old.id, old.question_text, IFNULL(old.stem,''), IFNULL(old.proposition,''), old.category, old.task);
                    END
                    """
                )
            )
            conn.execute(
                text(
                    """
                    CREATE TRIGGER IF NOT EXISTS questions_fts_au AFTER UPDATE ON questions BEGIN
                        INSERT INTO questions_fts(questions_fts, rowid, question_text, stem, proposition, category, task)
                        VALUES ('delete', old.id, old.question_text, IFNULL(old.stem,''), IFNULL(old.proposition,''), old.category, old.task);
                        INSERT INTO questions_fts(rowid, question_text, stem, proposition, category, task)
                        VALUES (new.id, new.question_text, IFNULL(new.stem,''), IFNULL(new.proposition,''), new.category, new.task);
                    END
                    """
                )
            )
    except Exception as e:
        logger.error(f"FTS migration failed (SQLite version might not support trigram): {e}")
