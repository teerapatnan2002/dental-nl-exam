import os
from datetime import datetime, timedelta
from typing import Optional

import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from pydantic import BaseModel
from sqlalchemy.orm import Session

import models
import schema
from database import get_db

# SECRET_KEY must be set via environment variable
SECRET_KEY = os.environ.get("SECRET_KEY") or os.environ.get("JWT_SECRET")
if not SECRET_KEY:
    raise RuntimeError(
        "SECRET_KEY or JWT_SECRET environment variable is not set. "
        "Generate a strong random key and set it before starting the app."
    )

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", "720"))  # 12 hours
REFRESH_TOKEN_EXPIRE_DAYS = int(os.environ.get("REFRESH_TOKEN_EXPIRE_DAYS", "30"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# ── Simple in‑memory rate limiter for login & register ──
_rate_limit_store: dict[str, list[float]] = {"login": [], "register": []}
_MAX_ATTEMPTS_PER_WINDOW = 10  # requests
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
            detail=f"Too many {key} attempts. Please try again later.",
        )


router = APIRouter(prefix="/api/auth", tags=["auth"])


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


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
def register_user(user: schema.UserCreate, db: Session = Depends(get_db)):
    _check_rate_limit("register")

    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=409, detail="Email already registered")

    db_username = db.query(models.User).filter(models.User.username == user.username).first()
    if db_username:
        raise HTTPException(status_code=409, detail="Username already taken")

    hashed_password = get_password_hash(user.password)
    now = int(datetime.utcnow().timestamp())
    db_user = models.User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password,
        created_at=now,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.post("/login", response_model=schema.Token)
def login_user(user: schema.UserLogin, db: Session = Depends(get_db)):
    _check_rate_limit("login")

    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
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