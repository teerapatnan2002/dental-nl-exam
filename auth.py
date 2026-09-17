import os
from datetime import datetime, timedelta
from typing import Optional

import jwt
from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from passlib.exc import UnknownHashError
from pydantic import BaseModel
from sqlalchemy import func, or_
from sqlalchemy.orm import Session

import models
import schema
from database import get_db

# SECRET_KEY: read from env or use default fallback for local dev
SECRET_KEY = os.environ.get("SECRET_KEY") or os.environ.get("JWT_SECRET") or "dental-nl-exam-super-secret-jwt-key-2026-production-fallback"

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", "720"))  # 12 hours
REFRESH_TOKEN_EXPIRE_DAYS = int(os.environ.get("REFRESH_TOKEN_EXPIRE_DAYS", "30"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# ── Per-IP in‑memory rate limiter for login & register ──
_rate_limit_store: dict[str, list[float]] = {}
_MAX_ATTEMPTS_PER_WINDOW = 30  # requests per IP
_RATE_WINDOW_SECONDS = 300      # 5 minutes


def _check_rate_limit(key: str) -> None:
    """Raise HTTP 429 if the key has exceeded the allowed number of attempts."""
    import time

    now = time.time()
    window_start = now - _RATE_WINDOW_SECONDS
    attempts = [t for t in _rate_limit_store.get(key, []) if t > window_start]
    attempts.append(now)
    _rate_limit_store[key] = attempts
    if len(attempts) > _MAX_ATTEMPTS_PER_WINDOW:
        raise HTTPException(
            status_code=429,
            detail="มีการพยายามเข้าสู่ระบบบ่อยเกินไป กรุณารอ 5 นาทีแล้วลองใหม่อีกครั้ง (Too many attempts. Please try again later.)",
        )


router = APIRouter(prefix="/api/auth", tags=["auth"])


def verify_password(plain_password, hashed_password):
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except (ValueError, UnknownHashError, Exception):
        return False


def get_password_hash(password):
    return pwd_context.hash(password)


def _create_token(data: dict, expires_delta: timedelta, token_type: str) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire, "type": token_type})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    return _create_token(
        data,
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        token_type="access",
    )


def create_refresh_token(data: dict):
    return _create_token(
        data,
        timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
        token_type="refresh",
    )


def _decode_token(token: str, expected_type: str) -> dict:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type", "access") != expected_type:  # legacy tokens have no "type"
            raise credentials_exception
        if payload.get("sub") is None:
            raise credentials_exception
        return payload
    except jwt.PyJWTError:
        raise credentials_exception


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = _decode_token(token, expected_type="access")
    username: str = payload.get("sub")
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


def get_current_admin(current_user: models.User = Depends(get_current_user)):
    """Require an admin user."""
    if getattr(current_user, "role", "user") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


@router.post("/register", response_model=schema.UserResponse)
def register_user(user: schema.UserCreate, request: Request, db: Session = Depends(get_db)):
    client_ip = request.client.host if request.client else "unknown"
    _check_rate_limit(f"register:{client_ip}")

    email_clean = user.email.strip().lower()
    username_clean = user.username.strip()

    db_user = db.query(models.User).filter(func.lower(models.User.email) == email_clean).first()
    if db_user:
        raise HTTPException(status_code=409, detail="อีเมลนี้ถูกลงทะเบียนไปแล้ว (Email already registered)")

    db_username = db.query(models.User).filter(func.lower(models.User.username) == username_clean.lower()).first()
    if db_username:
        raise HTTPException(status_code=409, detail="ชื่อผู้ใช้งานนี้ถูกใช้งานแล้ว (Username already taken)")

    hashed_password = get_password_hash(user.password)
    now = int(datetime.utcnow().timestamp())
    db_user = models.User(
        email=email_clean,
        username=username_clean,
        hashed_password=hashed_password,
        created_at=now,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.post("/login", response_model=schema.Token)
def login_user(user: schema.UserLogin, request: Request, db: Session = Depends(get_db)):
    client_ip = request.client.host if request.client else "unknown"
    _check_rate_limit(f"login:{client_ip}")

    ident = (user.email or "").strip()
    db_user = db.query(models.User).filter(
        or_(
            func.lower(models.User.email) == ident.lower(),
            func.lower(models.User.username) == ident.lower(),
        )
    ).first()

    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="อีเมล/ชื่อผู้ใช้งาน หรือรหัสผ่านไม่ถูกต้อง (Incorrect email/username or password)",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": db_user.username})
    refresh_token = create_refresh_token(data={"sub": db_user.username})
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


class RefreshRequest(BaseModel):
    refresh_token: str


@router.post("/refresh", response_model=schema.Token)
def refresh_access_token(req: RefreshRequest, db: Session = Depends(get_db)):
    """Exchange a valid refresh token for a new access (+refresh) token pair."""
    payload = _decode_token(req.refresh_token, expected_type="refresh")
    username: str = payload.get("sub")

    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return {
        "access_token": create_access_token(data={"sub": user.username}),
        "refresh_token": create_refresh_token(data={"sub": user.username}),
        "token_type": "bearer",
    }


@router.get("/me", response_model=schema.UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user


@router.get("/admin/users", response_model=list[schema.UserResponse])
def get_all_users(
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Admin only: list all registered users."""
    return db.query(models.User).order_by(models.User.id.asc()).all()


@router.get("/admin/users/export")
def export_users_csv(
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Admin only: export all registered users as a CSV file with UTF-8 BOM."""
    import io
    import csv

    users = db.query(models.User).order_by(models.User.id.asc()).all()
    output = io.StringIO()
    # Write UTF-8 BOM for seamless Thai & Excel compatibility
    output.write("\ufeff")
    writer = csv.writer(output)
    writer.writerow(["id", "email", "username", "role", "registered_at"])

    for u in users:
        reg_date = "-"
        if u.created_at:
            try:
                reg_date = datetime.fromtimestamp(int(u.created_at)).strftime("%Y-%m-%d %H:%M:%S")
            except Exception:
                reg_date = str(u.created_at)
        writer.writerow([u.id, u.email, u.username, u.role, reg_date])

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=registered_users.csv"},
    )