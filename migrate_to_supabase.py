#!/usr/bin/env python3
"""
Migrate all data from SQLite (data/exam_bank.db) to Supabase (PostgreSQL).

Usage:
    python3 migrate_to_supabase.py [TARGET_DATABASE_URL]
    OR set SUPABASE_DATABASE_URL in .env / environment variable.
"""

import sys
import os
import sqlite3
import logging
from dotenv import load_dotenv
from sqlalchemy import create_engine, text, inspect
from sqlalchemy.orm import sessionmaker

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("migration")

SQLITE_PATH = os.getenv("SQLITE_PATH", "data/exam_bank.db")
TARGET_URL = sys.argv[1] if len(sys.argv) > 1 else os.getenv("SUPABASE_DATABASE_URL") or os.getenv("DATABASE_URL")

if not TARGET_URL or TARGET_URL.startswith("sqlite"):
    logger.error("Target database URL is required and must be PostgreSQL!")
    print("\n[ERROR] Please provide a valid PostgreSQL connection string:")
    print("Example: python3 migrate_to_supabase.py \"postgresql://postgres.xxx:mypassword@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres\"\n")
    sys.exit(1)

# Normalize postgres:// to postgresql://
if TARGET_URL.startswith("postgres://"):
    TARGET_URL = TARGET_URL.replace("postgres://", "postgresql://", 1)

logger.info(f"Source SQLite: {SQLITE_PATH}")
logger.info(f"Target PostgreSQL: {TARGET_URL.split('@')[-1] if '@' in TARGET_URL else 'PostgreSQL'}")

# Import models
import models
from database import Base

# Setup PostgreSQL engine
pg_engine = create_engine(TARGET_URL, pool_pre_ping=True, pool_recycle=300)
PgSession = sessionmaker(bind=pg_engine)

def migrate():
    if not os.path.exists(SQLITE_PATH):
        logger.error(f"Source SQLite database not found at: {SQLITE_PATH}")
        sys.exit(1)

    # 1. Create tables in PostgreSQL
    logger.info("Creating tables in PostgreSQL if not exist...")
    Base.metadata.create_all(bind=pg_engine)

    # Connect SQLite
    sqlite_conn = sqlite3.connect(SQLITE_PATH)
    sqlite_conn.row_factory = sqlite3.Row
    s_cur = sqlite_conn.cursor()

    # Tables to migrate in dependency order
    tables = [
        "users",
        "questions",
        "choices",
        "exam_sessions",
        "user_answers",
        "user_question_stats",
        "reported_questions",
        "bookmarks",
        "user_notes"
    ]

    with pg_engine.begin() as pg_conn:
        for tbl in tables:
            # Check if table exists in SQLite
            s_cur.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{tbl}'")
            if not s_cur.fetchone():
                logger.warning(f"Table '{tbl}' does not exist in SQLite, skipping.")
                continue

            # Fetch columns in SQLite
            s_cur.execute(f"PRAGMA table_info({tbl})")
            sqlite_cols = [r["name"] for r in s_cur.fetchall()]

            # Fetch all rows from SQLite
            s_cur.execute(f"SELECT * FROM {tbl}")
            rows = s_cur.fetchall()
            row_count = len(rows)
            logger.info(f"Migrating table '{tbl}' ({row_count} rows)...")

            if row_count == 0:
                continue

            # Insert into PostgreSQL using ON CONFLICT DO NOTHING (or overwrite)
            col_names = ", ".join(f'"{c}"' for c in sqlite_cols)
            placeholders = ", ".join(f":{c}" for c in sqlite_cols)

            insert_sql = text(f"""
                INSERT INTO "{tbl}" ({col_names})
                VALUES ({placeholders})
                ON CONFLICT (id) DO NOTHING;
            """)

            batch_size = 500
            for i in range(0, row_count, batch_size):
                batch = [dict(r) for r in rows[i:i + batch_size]]
                pg_conn.execute(insert_sql, batch)

            logger.info(f"  ✓ Successfully migrated {row_count} rows into '{tbl}'")

        # Reset PostgreSQL serial sequences for tables with 'id'
        logger.info("Resetting PostgreSQL sequences...")
        for tbl in tables:
            try:
                seq_sql = text(f"""
                    SELECT setval(
                        pg_get_serial_sequence('"{tbl}"', 'id'),
                        COALESCE((SELECT MAX(id) + 1 FROM "{tbl}"), 1),
                        false
                    );
                """)
                pg_conn.execute(seq_sql)
            except Exception as e:
                # Sequence might not exist if column is not SERIAL
                pass

    sqlite_conn.close()

    # Verification report
    print("\n" + "="*50)
    print("📊 MIGRATION VERIFICATION REPORT")
    print("="*50)
    sqlite_conn = sqlite3.connect(SQLITE_PATH)
    sc = sqlite_conn.cursor()

    with pg_engine.connect() as pg_conn:
        for tbl in tables:
            sc.execute(f"SELECT count(*) FROM sqlite_master WHERE type='table' AND name='{tbl}'")
            if sc.fetchone()[0] == 0:
                continue
            sc.execute(f"SELECT count(*) FROM {tbl}")
            s_cnt = sc.fetchone()[0]
            p_cnt = pg_conn.execute(text(f'SELECT count(*) FROM "{tbl}"')).scalar()
            status = "✅ MATCH" if s_cnt == p_cnt else "⚠️ MISMATCH"
            print(f"Table '{tbl:20}': SQLite={s_cnt:6} | Postgres={p_cnt:6} | {status}")

    sqlite_conn.close()
    print("="*50)
    print("🎉 Migration Completed Successfully!\n")

if __name__ == "__main__":
    migrate()
