"""
Pre-flight environment variable validator for localhost and Vercel deployments.
Never prints secret values (keys, tokens, passwords, or full database URLs).

Usage:
    venv/bin/python scripts/check_vercel_env.py                  # validate local .env (dev mode)
    venv/bin/python scripts/check_vercel_env.py --production     # validate env against Vercel/prod rules
    venv/bin/python scripts/check_vercel_env.py --production --check-db
"""

import argparse
import os
import sys
import urllib.parse
from typing import Dict, List, Tuple

FALLBACK_SECRET = "dental-nl-exam-super-secret-jwt-key-2026-production-fallback"
PLACEHOLDER_MARKERS = ("YOUR_", "CHANGE_ME", "PLACEHOLDER", "[SENSITIVE]")


def _load_env_file(path: str) -> Dict[str, str]:
    vals: Dict[str, str] = {}
    if not path or not os.path.exists(path):
        return vals
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            s = line.strip()
            if not s or s.startswith("#") or "=" not in s:
                continue
            k, v = s.split("=", 1)
            vals[k.strip()] = v.strip().strip('"').strip("'")
    return vals


def _looks_placeholder(val: str) -> bool:
    up = val.upper()
    return any(m in up for m in PLACEHOLDER_MARKERS)


def validate_env(env: Dict[str, str], production: bool = False) -> Tuple[List[str], List[str], List[str]]:
    errors: List[str] = []
    warnings: List[str] = []
    passed: List[str] = []

    # 1. SECRET_KEY / JWT_SECRET
    secret = (env.get("SECRET_KEY") or env.get("JWT_SECRET") or "").strip()
    if not secret:
        errors.append("SECRET_KEY is missing")
    elif secret == FALLBACK_SECRET:
        errors.append("SECRET_KEY equals hardcoded fallback string")
    elif _looks_placeholder(secret):
        errors.append("SECRET_KEY appears to be a placeholder value")
    elif len(secret) < 32:
        errors.append(f"SECRET_KEY is too short (len={len(secret)}, minimum=32)")
    else:
        passed.append(f"SECRET_KEY: valid (len={len(secret)})")

    # 2. DATABASE_URL / POSTGRES_URL
    db_url = (env.get("DATABASE_URL") or env.get("POSTGRES_URL") or "").strip()
    if not db_url:
        if production:
            errors.append("DATABASE_URL (or POSTGRES_URL) is missing for production")
        else:
            warnings.append("DATABASE_URL unset; database.py defaults to sqlite:///./data/exam_bank.db locally")
    elif _looks_placeholder(db_url):
        errors.append("DATABASE_URL contains placeholder text")
    elif db_url.startswith("sqlite"):
        if production:
            errors.append("DATABASE_URL points to SQLite, which cannot run on Vercel serverless")
        else:
            passed.append("DATABASE_URL: local SQLite configured")
    else:
        parsed = urllib.parse.urlparse(db_url)
        if parsed.scheme not in ("postgres", "postgresql", "postgresql+psycopg"):
            errors.append(f"DATABASE_URL has unsupported scheme: {parsed.scheme!r}")
        elif not parsed.hostname:
            errors.append("DATABASE_URL is missing hostname")
        else:
            ssl_ok = "sslmode=require" in db_url or "sslmode=verify" in db_url
            pooler_hint = ""
            if "supabase.com" in (parsed.hostname or "") and parsed.port == 5432:
                pooler_hint = " (consider port 6543 Supabase Transaction Pooler for Vercel serverless)"
            if not ssl_ok:
                warnings.append("DATABASE_URL has no explicit sslmode=require query param (database.py will inject sslmode=require)")
            if pooler_hint:
                warnings.append(f"DATABASE_URL uses port 5432 on {parsed.hostname}{pooler_hint}")
            passed.append(
                f"DATABASE_URL: PostgreSQL host={parsed.hostname}, port={parsed.port or 5432}, ssl_query={ssl_ok}"
            )

    # 3. ALLOWED_ORIGINS
    origins_raw = (env.get("ALLOWED_ORIGINS") or "").strip()
    if not origins_raw:
        if production:
            warnings.append("ALLOWED_ORIGINS is empty; main.py will fall back to localhost-only origins")
        else:
            passed.append("ALLOWED_ORIGINS: empty (localhost defaults active)")
    else:
        origins = [o.strip() for o in origins_raw.split(",") if o.strip()]
        if "*" in origins:
            errors.append("ALLOWED_ORIGINS contains wildcard '*' which conflicts with allow_credentials=True")
        elif production:
            if not any(o.startswith("https://") for o in origins):
                warnings.append("ALLOWED_ORIGINS has no https:// origins for production")
            if "https://dental-nl-exam.vercel.app" not in origins:
                warnings.append("ALLOWED_ORIGINS does not include https://dental-nl-exam.vercel.app")
            passed.append(f"ALLOWED_ORIGINS: {len(origins)} origin(s) configured")
        else:
            passed.append(f"ALLOWED_ORIGINS: {len(origins)} origin(s) configured")

    # 4. TOTP_ENCRYPTION_KEY (recommended optional)
    totp_key = (env.get("TOTP_ENCRYPTION_KEY") or "").strip()
    if not totp_key:
        warnings.append(
            "TOTP_ENCRYPTION_KEY is not set (2FA secrets fall back to deriving key from SECRET_KEY; "
            "set an explicit Fernet key if you plan to rotate SECRET_KEY independently)"
        )
    else:
        try:
            from cryptography.fernet import Fernet
            Fernet(totp_key.encode("utf-8"))
            passed.append("TOTP_ENCRYPTION_KEY: valid Fernet key")
        except Exception:
            errors.append("TOTP_ENCRYPTION_KEY is set but is NOT a valid 44-char base64 Fernet key")

    # 5. OPENROUTER_API_KEY
    or_key = (env.get("OPENROUTER_API_KEY") or "").strip()
    if not or_key or _looks_placeholder(or_key):
        warnings.append("OPENROUTER_API_KEY not configured (AI Explain/Mock Gen disabled; Tutor uses offline fallback)")
    else:
        if not or_key.startswith("sk-or-"):
            warnings.append("OPENROUTER_API_KEY does not start with expected 'sk-or-' prefix")
        passed.append(f"OPENROUTER_API_KEY: configured (len={len(or_key)})")

    return passed, warnings, errors


def check_postgres_db(db_url: str) -> Tuple[bool, str]:
    try:
        import sqlalchemy as sa
        norm = db_url
        if norm.startswith("postgres://"):
            norm = "postgresql+psycopg://" + norm[len("postgres://"):]
        elif norm.startswith("postgresql://"):
            norm = "postgresql+psycopg://" + norm[len("postgresql://"):]
        kw = {"pool_pre_ping": True}
        if "sslmode" not in norm:
            kw["connect_args"] = {"sslmode": "require"}
        eng = sa.create_engine(norm, **kw)
        with eng.connect() as conn:
            q_cnt = conn.execute(sa.text("SELECT COUNT(*) FROM questions")).scalar()
            u_cnt = conn.execute(sa.text("SELECT COUNT(*) FROM users")).scalar()
            twofa_cnt = conn.execute(sa.text("SELECT COUNT(*) FROM users WHERE two_factor_enabled = 1")).scalar()
            no_rls = [
                r[0]
                for r in conn.execute(
                    sa.text(
                        "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND NOT rowsecurity ORDER BY tablename"
                    )
                ).fetchall()
            ]
        eng.dispose()
        if no_rls:
            return False, f"Connected (questions={q_cnt}, users={u_cnt}, 2fa={twofa_cnt}) BUT tables lack RLS: {no_rls}"
        return True, f"Connected OK (questions={q_cnt}, users={u_cnt}, 2fa_enabled={twofa_cnt}, RLS=enabled_on_all_tables)"
    except Exception as e:
        return False, f"Connection failed: {type(e).__name__}: {str(e)[:150]}"


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate environment config safely without printing secrets.")
    parser.add_argument("--env-file", default=".env", help="Optional .env file to load (overridden by process env)")
    parser.add_argument("--production", action="store_true", help="Enforce Vercel/production security checks")
    parser.add_argument("--check-db", action="store_true", help="Test live PostgreSQL connection and RLS status")
    args = parser.parse_args()

    merged: Dict[str, str] = {}
    if args.env_file and os.path.exists(args.env_file):
        merged.update(_load_env_file(args.env_file))
    # Process environment overrides file values (same precedence as runtime)
    for k, v in os.environ.items():
        if v:
            merged[k] = v

    passed, warnings, errors = validate_env(merged, production=args.production)

    print(f"Environment Pre-flight Check (mode={'production' if args.production else 'local'})")
    for p in passed:
        print(f"  [PASS] {p}")
    for w in warnings:
        print(f"  [WARN] {w}")
    for e in errors:
        print(f"  [FAIL] {e}")

    if args.check_db:
        db_url = (merged.get("DATABASE_URL") or merged.get("POSTGRES_URL") or "").strip()
        if not db_url or db_url.startswith("sqlite"):
            print("  [FAIL] --check-db requires a PostgreSQL DATABASE_URL")
            return 1
        ok, msg = check_postgres_db(db_url)
        print(f"  [{'PASS' if ok else 'FAIL'}] DB Check: {msg}")
        if not ok:
            return 1

    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
