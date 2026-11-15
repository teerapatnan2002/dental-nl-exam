import logging
import os
from dotenv import load_dotenv

load_dotenv()

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker

logger = logging.getLogger(__name__)

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "")

# Automatic transition: if pointing to old Tokyo project or unset on Vercel, use new Singapore project
SINGAPORE_SUPABASE_URL = "postgresql+psycopg://postgres.fgexylhuyaaedmtnplra:HuBAfgLaZ5IGeqpm@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require"

if not SQLALCHEMY_DATABASE_URL:
    if os.getenv("VERCEL"):
        SQLALCHEMY_DATABASE_URL = SINGAPORE_SUPABASE_URL
    else:
        SQLALCHEMY_DATABASE_URL = "sqlite:///./data/exam_bank.db"
elif "cbaytqufljdiwsetsgry" in SQLALCHEMY_DATABASE_URL:
    # Auto-redirect legacy Tokyo Supabase URL to new Singapore Supabase
    SQLALCHEMY_DATABASE_URL = SINGAPORE_SUPABASE_URL

# Normalize generic postgres URIs to postgresql+psycopg:// for psycopg3
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql+psycopg://", 1)
elif SQLALCHEMY_DATABASE_URL.startswith("postgresql://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)

connect_args = {}
engine_kwargs = {}

if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False
else:
    # Recommended pool settings for PostgreSQL (Supabase / Serverless)
    engine_kwargs["pool_pre_ping"] = True
    engine_kwargs["pool_recycle"] = 300
    connect_args["prepare_threshold"] = None
    if "sslmode" not in SQLALCHEMY_DATABASE_URL:
        connect_args["sslmode"] = "require"

if connect_args:
    engine_kwargs["connect_args"] = connect_args

engine = create_engine(SQLALCHEMY_DATABASE_URL, **engine_kwargs)
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
        "display_name": "ALTER TABLE users ADD COLUMN display_name VARCHAR",
        "dental_school": "ALTER TABLE users ADD COLUMN dental_school VARCHAR",
        "academic_year": "ALTER TABLE users ADD COLUMN academic_year VARCHAR",
        "target_exam_session": "ALTER TABLE users ADD COLUMN target_exam_session VARCHAR DEFAULT 'ครั้งที่ 1 ปี 2570'",
        "target_score_pct": "ALTER TABLE users ADD COLUMN target_score_pct INTEGER DEFAULT 75",
        "daily_goal_questions": "ALTER TABLE users ADD COLUMN daily_goal_questions INTEGER DEFAULT 20",
        "subscription_tier": "ALTER TABLE users ADD COLUMN subscription_tier VARCHAR NOT NULL DEFAULT 'early_access'",
        "subscription_status": "ALTER TABLE users ADD COLUMN subscription_status VARCHAR NOT NULL DEFAULT 'active'",
        "subscription_expires_at": "ALTER TABLE users ADD COLUMN subscription_expires_at INTEGER",
        "billing_customer_id": "ALTER TABLE users ADD COLUMN billing_customer_id VARCHAR",
        "two_factor_enabled": "ALTER TABLE users ADD COLUMN two_factor_enabled INTEGER NOT NULL DEFAULT 0",
        "totp_secret_enc": "ALTER TABLE users ADD COLUMN totp_secret_enc VARCHAR",
        "totp_pending_secret_enc": "ALTER TABLE users ADD COLUMN totp_pending_secret_enc VARCHAR",
        "totp_backup_codes": "ALTER TABLE users ADD COLUMN totp_backup_codes TEXT",
        "totp_last_used_step": "ALTER TABLE users ADD COLUMN totp_last_used_step BIGINT",
        "two_factor_enabled_at": "ALTER TABLE users ADD COLUMN two_factor_enabled_at INTEGER",
    },
    "exam_sessions": {
        "time_limit_seconds": "ALTER TABLE exam_sessions ADD COLUMN time_limit_seconds INTEGER",
        "time_spent_seconds": "ALTER TABLE exam_sessions ADD COLUMN time_spent_seconds INTEGER",
    },
    "user_answers": {
        "time_spent_seconds": "ALTER TABLE user_answers ADD COLUMN time_spent_seconds INTEGER",
        "confidence": "ALTER TABLE user_answers ADD COLUMN confidence VARCHAR",
    },
    "user_question_stats": {
        "last_quality": "ALTER TABLE user_question_stats ADD COLUMN last_quality INTEGER",
        "lapse_count": "ALTER TABLE user_question_stats ADD COLUMN lapse_count INTEGER NOT NULL DEFAULT 0",
        "last_reviewed_at": "ALTER TABLE user_question_stats ADD COLUMN last_reviewed_at INTEGER",
        "last_confidence": "ALTER TABLE user_question_stats ADD COLUMN last_confidence VARCHAR",
    },
    "reported_questions": {
        "admin_reply": "ALTER TABLE reported_questions ADD COLUMN admin_reply VARCHAR",
    },
    "user_notes": {
        "topic_id": "ALTER TABLE user_notes ADD COLUMN topic_id VARCHAR",
        "mistake_tag": "ALTER TABLE user_notes ADD COLUMN mistake_tag VARCHAR",
    },
}

_INDEX_MIGRATIONS = [
    "CREATE INDEX IF NOT EXISTS ix_user_qstat_user_due ON user_question_stats (user_id, next_review_date)",
    "CREATE INDEX IF NOT EXISTS ix_user_card_reviews_user_due ON user_card_reviews (user_id, card_type, next_review_date)",
    "CREATE INDEX IF NOT EXISTS ix_user_notes_tag ON user_notes (user_id, mistake_tag)",
    "CREATE INDEX IF NOT EXISTS ix_user_topic_notes_user_updated ON user_topic_notes (user_id, updated_at)",
    "CREATE INDEX IF NOT EXISTS ix_active_presence_last_seen ON active_presence (last_seen_at)",
]


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
        for idx_ddl in _INDEX_MIGRATIONS:
            try:
                conn.execute(text(idx_ddl))
            except Exception as exc:
                logger.warning("Index migration skipped (%s): %s", idx_ddl, exc)
        if not SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
            for rls_table in (
                "users",
                "exam_sessions",
                "user_answers",
                "user_question_stats",
                "user_card_reviews",
                "reported_questions",
                "bookmarks",
                "user_notes",
                "user_topic_notes",
                "active_presence",
            ):
                try:
                    conn.execute(text(f"ALTER TABLE public.{rls_table} ENABLE ROW LEVEL SECURITY;"))
                    conn.execute(
                        text(
                            f"""
                            DO $$
                            BEGIN
                                IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
                                    REVOKE ALL ON public.{rls_table} FROM anon;
                                END IF;
                                IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
                                    REVOKE ALL ON public.{rls_table} FROM authenticated;
                                END IF;
                            END $$;
                            """
                        )
                    )
                except Exception as exc:
                    logger.warning("Supabase RLS migration skipped for %s: %s", rls_table, exc)


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
