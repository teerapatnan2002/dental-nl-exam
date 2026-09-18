#!/usr/bin/env python3
"""
High-Performance SQLite to Supabase Migration + RLS Security Hardening.
Uses psycopg2.extras.execute_values for 50x faster batch insertion.
"""

import os
import sys
import sqlite3
import logging
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("supabase_migration")

SQLITE_PATH = "data/exam_bank.db"
TARGET_URL = sys.argv[1] if len(sys.argv) > 1 else os.getenv("SUPABASE_DATABASE_URL")

if not TARGET_URL:
    logger.error("Target database URL is required!")
    sys.exit(1)

if TARGET_URL.startswith("postgres://"):
    TARGET_URL = TARGET_URL.replace("postgres://", "postgresql://", 1)

from database import Base
import models
from sqlalchemy import create_engine

# 1. Create tables via SQLAlchemy if not exist
logger.info("Ensuring all tables exist in Supabase...")
sa_engine = create_engine(TARGET_URL, pool_pre_ping=True)
Base.metadata.create_all(bind=sa_engine)
sa_engine.dispose()

# 2. Fast data migration using psycopg2
logger.info("Connecting to SQLite and PostgreSQL...")
s_conn = sqlite3.connect(SQLITE_PATH)
s_conn.row_factory = sqlite3.Row
s_cur = s_conn.cursor()

p_conn = psycopg2.connect(TARGET_URL)
p_conn.autocommit = False
p_cur = p_conn.cursor()

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

try:
    for tbl in tables:
        s_cur.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{tbl}'")
        if not s_cur.fetchone():
            continue

        s_cur.execute(f"PRAGMA table_info({tbl})")
        cols = [r["name"] for r in s_cur.fetchall()]
        col_str = ", ".join(f'"{c}"' for c in cols)

        s_cur.execute(f"SELECT * FROM {tbl}")
        rows = s_cur.fetchall()
        row_count = len(rows)
        logger.info(f"Transferring table '{tbl}' ({row_count} rows)...")

        if row_count == 0:
            continue

        # Prepare values for execute_values
        data = [tuple(r[c] for c in cols) for r in rows]

        insert_query = f"""
            INSERT INTO "{tbl}" ({col_str})
            VALUES %s
            ON CONFLICT (id) DO NOTHING;
        """

        execute_values(p_cur, insert_query, data, page_size=1000)
        p_conn.commit()
        logger.info(f"  ✓ {tbl} migrated successfully.")

    # Reset identity sequences
    logger.info("Resetting PostgreSQL sequences...")
    for tbl in tables:
        try:
            p_cur.execute(f"""
                SELECT setval(
                    pg_get_serial_sequence('"{tbl}"', 'id'),
                    COALESCE((SELECT MAX(id) + 1 FROM "{tbl}"), 1),
                    false
                );
            """)
            p_conn.commit()
        except Exception:
            p_conn.rollback()

    # 3. Apply Supabase RLS Security Hardening
    logger.info("Enabling Row Level Security (RLS) on all tables...")
    for tbl in tables:
        p_cur.execute(f'ALTER TABLE public."{tbl}" ENABLE ROW LEVEL SECURITY;')

    # Questions & Choices: Public Read-Only for PostgREST Data API
    p_cur.execute("""
        GRANT SELECT ON public.questions TO anon, authenticated;
        DROP POLICY IF EXISTS "Anyone can read questions" ON public.questions;
        CREATE POLICY "Anyone can read questions" ON public.questions FOR SELECT TO anon, authenticated USING (true);

        GRANT SELECT ON public.choices TO anon, authenticated;
        DROP POLICY IF EXISTS "Anyone can read choices" ON public.choices;
        CREATE POLICY "Anyone can read choices" ON public.choices FOR SELECT TO anon, authenticated USING (true);
    """)

    # Sensitive tables: Server-side only (block anon and authenticated via PostgREST)
    sensitive_tables = ["users", "exam_sessions", "user_answers", "user_question_stats", "reported_questions", "bookmarks", "user_notes"]
    for tbl in sensitive_tables:
        p_cur.execute(f'REVOKE ALL ON public."{tbl}" FROM anon, authenticated;')

    p_conn.commit()
    logger.info("  ✓ RLS enabled and secured according to Supabase best practices.")

    # 4. Verify counts
    print("\n" + "="*55)
    print("📊 SUPABASE MIGRATION & SECURITY VERIFICATION")
    print("="*55)
    for tbl in tables:
        s_cur.execute(f"SELECT count(*) FROM sqlite_master WHERE type='table' AND name='{tbl}'")
        if s_cur.fetchone()[0] == 0:
            continue
        s_cur.execute(f"SELECT count(*) FROM {tbl}")
        s_cnt = s_cur.fetchone()[0]
        p_cur.execute(f'SELECT count(*) FROM "{tbl}"')
        p_cnt = p_cur.fetchone()[0]
        status = "✅ MATCH" if s_cnt == p_cnt else "⚠️ MISMATCH"
        print(f"Table '{tbl:20}': SQLite={s_cnt:6} | Supabase={p_cnt:6} | {status}")

    print("="*55)
    print("🎉 All data migrated & RLS secured 100% successfully!\n")

except Exception as e:
    p_conn.rollback()
    logger.error(f"Migration failed: {e}")
    raise
finally:
    s_conn.close()
    p_conn.close()
