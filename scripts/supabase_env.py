"""Shared environment-based Supabase PostgreSQL connection helper for maintenance scripts."""

import os

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass


def get_supabase_url(*, sqlalchemy: bool = True) -> str:
    """Return the PostgreSQL connection string from env vars without hardcoding credentials."""
    url = (
        os.getenv("SUPABASE_DATABASE_URL")
        or os.getenv("DATABASE_URL")
        or os.getenv("POSTGRES_URL")
        or ""
    ).strip()
    if not url or url.startswith("sqlite"):
        raise RuntimeError(
            "SUPABASE_DATABASE_URL (or a Postgres DATABASE_URL) must be set in the environment or .env."
        )

    if sqlalchemy:
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+psycopg://", 1)
        elif url.startswith("postgresql://"):
            url = url.replace("postgresql://", "postgresql+psycopg://", 1)
    else:
        if url.startswith("postgresql+psycopg://"):
            url = url.replace("postgresql+psycopg://", "postgresql://", 1)
        elif url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)

    return url
