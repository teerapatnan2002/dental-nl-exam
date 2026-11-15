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


SUBSCRIPTION_PLANS_CATALOG = {
    "enforcement_mode": "early_access",
    "early_access_all_unlocked": True,
    "disclaimer": (
        "แพ็กเกจสมาชิกนี้เป็นค่าบริการใช้งานระบบคลังข้อสอบและเครื่องมือวิเคราะห์บนเว็บไซต์ NL Dental Treasury เท่านั้น "
        "ไม่เกี่ยวข้องและไม่รวมค่าธรรมเนียมการสมัครสอบของศูนย์ประเมินและรับรองความรู้ความสามารถในการประกอบวิชาชีพทันตกรรม (ศ.ป.ท.)"
    ),
    "plans": [
        {
            "id": "free",
            "name": "Free Plan",
            "tagline": "สำหรับทดลองฝึกซ้อมและดูแนวข้อสอบเบื้องต้น",
            "price_thb": 0,
            "billing_period": "ตลอดชีพ",
            "badge": "เริ่มต้นฟรี",
            "available_now": True,
            "features": [
                "สุ่มฝึกซ้อมข้อสอบรายวัน (จำกัด 20 ข้อ/วัน เมื่อเปิดระบบสมาชิก)",
                "ดูตารางกำหนดการสอบและตัวนับถอยหลัง ศ.ป.ท.",
                "เข้าถึงสรุปกฎหมายทันตแพทยสภาและโครงสร้างเกณฑ์ TOS 2563",
                "บันทึกบุ๊กมาร์กข้อสอบพื้นฐาน",
            ],
        },
        {
            "id": "pro",
            "name": "Pro Plan",
            "tagline": "ปลดล็อกคลังข้อสอบ สรุปคลินิก และเครื่องมือวิเคราะห์ครบทุกฟีเจอร์",
            "price_thb": 199,
            "billing_period": "ต่อเดือน",
            "badge": "แนะนำ · ปลดล็อกครบทุกฟีเจอร์",
            "highlight": True,
            "available_now": False,
            "features": [
                "ปลดล็อกคลังข้อสอบจริงและข้อสอบจำลองครบทั้ง 2,443 ข้อ ไม่จำกัดจำนวนครั้ง",
                "เฉลยละเอียดรายตัวเลือก + แผนผัง Clinical Pathway ครบ 83 หัวข้อ",
                "ใช้งาน Calc Lab คำนวณคลินิก และ Cloze & กับดักข้อสอบครบทุกด่าน",
                "ระบบทบทวนข้อที่เคยทำผิดอัตโนมัติ (SM-2) และวิเคราะห์จุดอ่อนรายสาขาเชิงลึก",
                "ส่งออกและสั่งพิมพ์สมุดโน้ตส่วนตัว High-Yield Cheat Sheet (PDF) ไม่จำกัด",
            ],
        },
    ],
}


@router.get("/subscription-plans")
def get_subscription_plans():
    """Return future subscription tier definitions and current Early Access status."""
    return SUBSCRIPTION_PLANS_CATALOG


@router.patch("/profile", response_model=schema.UserResponse)
@router.put("/profile", response_model=schema.UserResponse)
def update_user_profile(
    payload: schema.UserProfileUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update the authenticated user's profile and study goals."""
    if payload.username is not None:
        new_username = payload.username.strip()
        if new_username.lower() != current_user.username.lower():
            existing_u = (
                db.query(models.User)
                .filter(func.lower(models.User.username) == new_username.lower(), models.User.id != current_user.id)
                .first()
            )
            if existing_u:
                raise HTTPException(status_code=409, detail="ชื่อผู้ใช้งานนี้ถูกใช้งานแล้ว (Username already taken)")
        current_user.username = new_username

    if payload.email is not None:
        new_email = payload.email.strip().lower()
        if new_email != current_user.email.lower():
            existing_e = (
                db.query(models.User)
                .filter(func.lower(models.User.email) == new_email, models.User.id != current_user.id)
                .first()
            )
            if existing_e:
                raise HTTPException(status_code=409, detail="อีเมลนี้ถูกลงทะเบียนไปแล้ว (Email already registered)")
        current_user.email = new_email

    if payload.display_name is not None:
        current_user.display_name = payload.display_name.strip() or None
    if payload.dental_school is not None:
        current_user.dental_school = payload.dental_school.strip() or None
    if payload.academic_year is not None:
        current_user.academic_year = payload.academic_year.strip() or None
    if payload.target_exam_session is not None:
        current_user.target_exam_session = payload.target_exam_session.strip() or "NL 1/2570"
    if payload.target_score_pct is not None:
        current_user.target_score_pct = int(payload.target_score_pct)
    if payload.daily_goal_questions is not None:
        current_user.daily_goal_questions = int(payload.daily_goal_questions)

    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    # Issue fresh tokens if username changed so active session stays valid
    response_data = schema.UserResponse.model_validate(current_user, from_attributes=True)
    response_data.access_token = create_access_token(data={"sub": current_user.username})
    response_data.refresh_token = create_refresh_token(data={"sub": current_user.username})
    return response_data


@router.post("/change-password")
def change_user_password(
    payload: schema.PasswordChangeRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Change the authenticated user's password after verifying current_password."""
    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="รหัสผ่านปัจจุบันไม่ถูกต้อง")
    if payload.current_password == payload.new_password:
        raise HTTPException(status_code=400, detail="รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสผ่านเดิม")

    current_user.hashed_password = get_password_hash(payload.new_password)
    db.add(current_user)
    db.commit()
    return {"status": "ok", "message": "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว"}


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