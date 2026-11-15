import hashlib
import hmac
import logging
import os
import time
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
import totp_service
from database import get_db

logger = logging.getLogger(__name__)

# SECRET_KEY: read from env or use default fallback for local dev
_FALLBACK_SECRET_KEY = "dental-nl-exam-super-secret-jwt-key-2026-production-fallback"
SECRET_KEY = os.environ.get("SECRET_KEY") or os.environ.get("JWT_SECRET") or _FALLBACK_SECRET_KEY
if (SECRET_KEY == _FALLBACK_SECRET_KEY or len(SECRET_KEY) < 32) and (
    os.environ.get("VERCEL") or os.environ.get("ENV") == "production"
):
    raise RuntimeError(
        "SECURITY ERROR: Weak or fallback SECRET_KEY detected in production. "
        "Set a strong random SECRET_KEY (>= 32 chars) in Environment Variables."
    )

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", "720"))  # 12 hours
REFRESH_TOKEN_EXPIRE_DAYS = int(os.environ.get("REFRESH_TOKEN_EXPIRE_DAYS", "30"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# ── Bounded per-IP & per-account in-memory rate limiter ──
_rate_limit_store: dict[str, list[float]] = {}
_MAX_ATTEMPTS_PER_WINDOW = 30  # default requests per window
_RATE_WINDOW_SECONDS = 300      # 5 minutes
_MAX_STORE_KEYS = 2000


def _get_client_ip(request: Request) -> str:
    """Extract client IP safely across Vercel edge headers, reverse proxies, and direct connections."""
    for header_name in ("x-vercel-forwarded-for", "x-real-ip"):
        val = (request.headers.get(header_name) or "").strip()
        if val:
            first_ip = val.split(",")[0].strip()
            if first_ip:
                return first_ip[:64]
    xff = (request.headers.get("x-forwarded-for") or "").strip()
    if xff:
        first_ip = xff.split(",")[0].strip()
        if first_ip:
            return first_ip[:64]
    return (request.client.host if request.client else "unknown")[:64]


def _check_rate_limit(
    key: str,
    max_attempts: int = _MAX_ATTEMPTS_PER_WINDOW,
    window_seconds: int = _RATE_WINDOW_SECONDS,
) -> None:
    """Raise HTTP 429 if the key has exceeded the allowed number of attempts."""
    now = time.time()
    window_start = now - window_seconds

    # Periodically evict expired keys so memory stays bounded
    if len(_rate_limit_store) > _MAX_STORE_KEYS:
        cutoff = now - max(window_seconds, _RATE_WINDOW_SECONDS)
        stale_keys = [k for k, ts_list in _rate_limit_store.items() if not ts_list or ts_list[-1] <= cutoff]
        for k in stale_keys:
            _rate_limit_store.pop(k, None)

    attempts = [t for t in _rate_limit_store.get(key, []) if t > window_start]
    if len(attempts) >= max_attempts:
        _rate_limit_store[key] = attempts
        raise HTTPException(
            status_code=429,
            detail="มีการส่งคำขอบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่อีกครั้ง (Too many attempts. Please try again later.)",
        )
    attempts.append(now)
    _rate_limit_store[key] = attempts


router = APIRouter(prefix="/api/auth", tags=["auth"])


def verify_password(plain_password, hashed_password):
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except (ValueError, UnknownHashError, Exception):
        return False


def get_password_hash(password):
    return pwd_context.hash(password)


def _password_fingerprint(hashed_password: Optional[str]) -> str:
    """Return a short non-reversible digest of the current password hash so tokens auto-revoke on password change."""
    return hashlib.sha256((hashed_password or "").encode("utf-8")).hexdigest()[:12]


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


def create_2fa_challenge_token(username: str, pwd_sig: Optional[str] = None) -> str:
    payload = {"sub": username}
    if pwd_sig:
        payload["pwd_sig"] = pwd_sig
    return _create_token(
        payload,
        timedelta(minutes=5),
        token_type="2fa_pending",
    )


def _decode_token(token: str, expected_type: str) -> dict:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        tok_type = payload.get("type")
        if expected_type == "access":
            if tok_type not in ("access", None):
                raise credentials_exception
        elif tok_type != expected_type:
            raise credentials_exception
        if payload.get("sub") is None:
            raise credentials_exception
        return payload
    except jwt.PyJWTError:
        raise credentials_exception


def _verify_token_password_sig(payload: dict, user: models.User) -> None:
    """Reject tokens issued before the most recent password change."""
    tok_sig = payload.get("pwd_sig")
    if tok_sig is not None:
        expected_sig = _password_fingerprint(user.hashed_password)
        if not hmac.compare_digest(str(tok_sig), expected_sig):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="เซสชันหมดอายุเนื่องจากมีการเปลี่ยนรหัสผ่าน กรุณาเข้าสู่ระบบใหม่อีกครั้ง",
                headers={"WWW-Authenticate": "Bearer"},
            )


def _resolve_user_from_access_token(token: str, db: Session) -> models.User:
    payload = _decode_token(token, expected_type="access")
    username: str = payload.get("sub")
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    _verify_token_password_sig(payload, user)
    return user


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    return _resolve_user_from_access_token(token, db)


def get_optional_current_user(request: Request, db: Session = Depends(get_db)) -> Optional[models.User]:
    """Return authenticated user if Bearer token is sent; None if unauthenticated.
    Still raises 401 for malformed/expired non-empty tokens so clients refresh cleanly."""
    auth_header = (request.headers.get("Authorization") or "").strip()
    if not auth_header or not auth_header.lower().startswith("bearer "):
        return None
    token = auth_header[7:].strip()
    if not token or token.lower() in ("null", "undefined", "none"):
        return None
    return _resolve_user_from_access_token(token, db)


def get_current_admin(current_user: models.User = Depends(get_current_user)):
    """Require an admin user."""
    if getattr(current_user, "role", "user") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


@router.post("/register", response_model=schema.UserResponse)
def register_user(user: schema.UserCreate, request: Request, db: Session = Depends(get_db)):
    client_ip = _get_client_ip(request)
    _check_rate_limit(f"register:{client_ip}", max_attempts=15)

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
    client_ip = _get_client_ip(request)
    ident = (user.email or "").strip()
    _check_rate_limit(f"login:{client_ip}", max_attempts=25)
    if ident:
        _check_rate_limit(f"login-acct:{ident.lower()}", max_attempts=12)

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

    pwd_sig = _password_fingerprint(db_user.hashed_password)
    if bool(db_user.two_factor_enabled):
        return {
            "requires_2fa": True,
            "challenge_token": create_2fa_challenge_token(db_user.username, pwd_sig=pwd_sig),
            "token_type": "bearer",
        }

    token_data = {"sub": db_user.username, "pwd_sig": pwd_sig}
    access_token = create_access_token(data=token_data)
    refresh_token = create_refresh_token(data=token_data)
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "requires_2fa": False,
    }


class RefreshRequest(BaseModel):
    refresh_token: str


@router.post("/refresh", response_model=schema.Token)
def refresh_access_token(req: RefreshRequest, request: Request, db: Session = Depends(get_db)):
    """Exchange a valid refresh token for a new access (+refresh) token pair."""
    client_ip = _get_client_ip(request)
    _check_rate_limit(f"refresh:{client_ip}", max_attempts=60)

    payload = _decode_token(req.refresh_token, expected_type="refresh")
    username: str = payload.get("sub")

    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    _verify_token_password_sig(payload, user)

    token_data = {"sub": user.username, "pwd_sig": _password_fingerprint(user.hashed_password)}
    return {
        "access_token": create_access_token(data=token_data),
        "refresh_token": create_refresh_token(data=token_data),
        "token_type": "bearer",
    }


@router.get("/me", response_model=schema.UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user


SUBSCRIPTION_PLANS_CATALOG = {
    "enforcement_mode": "free",
    "early_access_all_unlocked": True,
    "disclaimer": (
        "NL Dental Treasury เปิดให้บริการใช้งานคลังข้อสอบและเครื่องมือเตรียมสอบฟรีทั้งหมดภายใต้ Free Plan ไม่มีค่าใช้จ่าย "
        "(เว็บไซต์นี้ไม่เกี่ยวข้องกับค่าธรรมเนียมการสมัครสอบของศูนย์ประเมินและรับรองความรู้ความสามารถในการประกอบวิชาชีพทันตกรรม หรือ ศ.ป.ท.)"
    ),
    "plans": [
        {
            "id": "free",
            "name": "Free Plan",
            "tagline": "เปิดใช้งานฟรีครบทุกฟีเจอร์สำหรับผู้เตรียมสอบทุกคน ไม่มีค่าใช้จ่าย",
            "price_thb": 0,
            "billing_period": "ฟรี",
            "badge": "กำลังใช้งานอยู่ · ฟรีทั้งหมด",
            "available_now": True,
            "features": [
                "เข้าถึงคลังข้อสอบจริงและข้อสอบจำลองครบทุกชุด ไม่จำกัดจำนวนครั้ง",
                "เฉลยละเอียดรายตัวเลือก พร้อมสรุปคลินิกและแผนผัง Clinical Pathway ครบทุกหัวข้อ",
                "ใช้งาน Calc Lab คำนวณคลินิก, Cloze & กับดักข้อสอบ และสรุปกฎหมายทันตแพทยสภา",
                "ระบบทบทวนข้อที่เคยทำผิดอัตโนมัติ (SM-2), บุ๊กมาร์ก และสถิติวิเคราะห์จุดอ่อนรายสาขา",
                "ดูตารางกำหนดการสอบและตัวนับถอยหลัง ศ.ป.ท. พร้อมตั้งเป้าหมายส่วนตัว",
            ],
        },
    ],
}


@router.get("/subscription-plans")
def get_subscription_plans():
    """Return active Free Plan catalog."""
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
        current_user.target_exam_session = schema.normalize_exam_session_label(payload.target_exam_session)
    if payload.target_score_pct is not None:
        current_user.target_score_pct = int(payload.target_score_pct)
    if payload.daily_goal_questions is not None:
        current_user.daily_goal_questions = int(payload.daily_goal_questions)

    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    # Issue fresh tokens if username changed so active session stays valid
    pwd_sig = _password_fingerprint(current_user.hashed_password)
    token_data = {"sub": current_user.username, "pwd_sig": pwd_sig}
    response_data = schema.UserResponse.model_validate(current_user, from_attributes=True)
    response_data.access_token = create_access_token(data=token_data)
    response_data.refresh_token = create_refresh_token(data=token_data)
    return response_data


@router.post("/change-password")
def change_user_password(
    payload: schema.PasswordChangeRequest,
    request: Request,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Change the authenticated user's password after verifying current_password."""
    client_ip = _get_client_ip(request)
    _check_rate_limit(f"pwd-change:{current_user.id}:{client_ip}", max_attempts=10)

    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="รหัสผ่านปัจจุบันไม่ถูกต้อง")
    if payload.current_password == payload.new_password:
        raise HTTPException(status_code=400, detail="รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสผ่านเดิม")

    current_user.hashed_password = get_password_hash(payload.new_password)
    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    pwd_sig = _password_fingerprint(current_user.hashed_password)
    token_data = {"sub": current_user.username, "pwd_sig": pwd_sig}
    return {
        "status": "ok",
        "message": "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว",
        "access_token": create_access_token(data=token_data),
        "refresh_token": create_refresh_token(data=token_data),
    }


def _verify_user_second_factor(
    db_user: models.User,
    submitted_code: str,
    allow_backup: bool = True,
) -> str:
    """Validate either live 6-digit TOTP (updating anti-replay step) or a single-use backup code.

    Returns 'totp' or 'backup' on success; raises HTTPException(400/401) otherwise.
    """
    secret_b32 = totp_service.decrypt_totp_secret(db_user.totp_secret_enc, SECRET_KEY)
    if not secret_b32:
        raise HTTPException(status_code=500, detail="ข้อมูลลับ 2FA เสียหาย กรุณาติดต่อผู้ดูแลระบบ")

    matched_step = totp_service.verify_totp_code(
        secret_b32,
        submitted_code,
        last_used_step=db_user.totp_last_used_step,
    )
    if matched_step is not None:
        db_user.totp_last_used_step = matched_step
        return "totp"

    if allow_backup:
        ok_backup, updated_json = totp_service.consume_backup_code(db_user.totp_backup_codes, submitted_code)
        if ok_backup:
            db_user.totp_backup_codes = updated_json
            return "backup"

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="รหัสยืนยัน 2FA หรือรหัสสำรองไม่ถูกต้อง (กรุณาเช็กเวลาบนอุปกรณ์และลองอีกครั้ง)",
    )


@router.get("/2fa/status")
def get_two_factor_status(current_user: models.User = Depends(get_current_user)):
    """Return current user's 2FA status and remaining backup codes count."""
    return {
        "enabled": bool(current_user.two_factor_enabled),
        "enabled_at": current_user.two_factor_enabled_at,
        "backup_codes_remaining": current_user.two_factor_backup_remaining,
    }


@router.post("/2fa/setup")
def setup_two_factor(
    request: Request,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Generate a pending encrypted TOTP secret and local SVG QR code for activation."""
    client_ip = _get_client_ip(request)
    _check_rate_limit(f"2fa-setup:{current_user.id}:{client_ip}", max_attempts=15)

    if bool(current_user.two_factor_enabled):
        raise HTTPException(
            status_code=400,
            detail="บัญชีนี้เปิดใช้งาน 2FA อยู่แล้ว หากต้องการเปลี่ยนอุปกรณ์กรุณาปิดการใช้งานก่อน",
        )

    raw_secret = totp_service.generate_totp_secret()
    account_label = current_user.email or current_user.username
    otpauth_uri = totp_service.build_otpauth_uri(account_label, raw_secret)
    qr_data_uri = totp_service.render_qr_svg_data_uri(otpauth_uri)

    current_user.totp_pending_secret_enc = totp_service.encrypt_totp_secret(raw_secret, SECRET_KEY)
    db.add(current_user)
    db.commit()

    return {
        "secret": raw_secret,
        "otpauth_uri": otpauth_uri,
        "qr_data_uri": qr_data_uri,
        "issuer": totp_service.TOTP_ISSUER,
        "account": account_label,
    }


@router.post("/2fa/enable")
def enable_two_factor(
    payload: schema.TwoFactorCodeConfirmRequest,
    request: Request,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Verify initial 6-digit TOTP against pending secret, activate 2FA, and return one-time backup codes."""
    client_ip = _get_client_ip(request)
    _check_rate_limit(f"2fa-enable:{current_user.id}:{client_ip}", max_attempts=10)

    if bool(current_user.two_factor_enabled):
        raise HTTPException(status_code=400, detail="บัญชีนี้เปิดใช้งาน 2FA อยู่แล้ว")
    if not current_user.totp_pending_secret_enc:
        raise HTTPException(status_code=400, detail="ยังไม่ได้สร้าง QR Setup กรุณากดเริ่มตั้งค่า 2FA ใหม่อีกครั้ง")

    pending_secret = totp_service.decrypt_totp_secret(current_user.totp_pending_secret_enc, SECRET_KEY)
    if not pending_secret:
        raise HTTPException(status_code=400, detail="คีย์ตั้งค่าหมดอายุหรือไม่ถูกต้อง กรุณาสร้าง QR ใหม่อีกครั้ง")

    matched_step = totp_service.verify_totp_code(pending_secret, payload.code)
    if matched_step is None:
        raise HTTPException(
            status_code=400,
            detail="รหัส 6 หลักไม่ถูกต้อง กรุณาตรวจสอบนาฬิกาบนอุปกรณ์และกรอกรหัสล่าสุดอีกครั้ง",
        )

    plaintext_codes, hashed_json = totp_service.generate_backup_codes()
    current_user.totp_secret_enc = current_user.totp_pending_secret_enc
    current_user.totp_pending_secret_enc = None
    current_user.totp_backup_codes = hashed_json
    current_user.totp_last_used_step = matched_step
    current_user.two_factor_enabled = 1
    current_user.two_factor_enabled_at = int(time.time())
    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return {
        "enabled": True,
        "enabled_at": current_user.two_factor_enabled_at,
        "backup_codes": plaintext_codes,
        "backup_codes_remaining": len(plaintext_codes),
    }


@router.post("/2fa/verify-login", response_model=schema.Token)
def verify_two_factor_login(
    payload: schema.TwoFactorVerifyLoginRequest,
    request: Request,
    db: Session = Depends(get_db),
):
    """Complete Step-2 authentication by verifying a 5-minute 2FA challenge token + OTP/backup code."""
    client_ip = _get_client_ip(request)
    _check_rate_limit(f"2fa-login:{client_ip}", max_attempts=15)

    token_payload = _decode_token(payload.challenge_token, expected_type="2fa_pending")
    username = token_payload.get("sub")
    if username:
        _check_rate_limit(f"2fa-login-acct:{username.lower()}", max_attempts=8)

    db_user = db.query(models.User).filter(models.User.username == username).first()
    if not db_user or not bool(db_user.two_factor_enabled):
        raise HTTPException(status_code=401, detail="คำขอเข้าสู่ระบบ 2FA ไม่ถูกต้องหรือหมดอายุแล้ว")
    _verify_token_password_sig(token_payload, db_user)

    _verify_user_second_factor(db_user, payload.code, allow_backup=True)
    db.add(db_user)
    db.commit()

    token_data = {"sub": db_user.username, "pwd_sig": _password_fingerprint(db_user.hashed_password)}
    return {
        "access_token": create_access_token(data=token_data),
        "refresh_token": create_refresh_token(data=token_data),
        "token_type": "bearer",
        "requires_2fa": False,
    }


@router.post("/2fa/backup-codes/regenerate")
def regenerate_backup_codes(
    payload: schema.TwoFactorCodeConfirmRequest,
    request: Request,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Generate 8 new backup recovery codes after verifying a live 6-digit TOTP code."""
    client_ip = _get_client_ip(request)
    _check_rate_limit(f"2fa-regen:{current_user.id}:{client_ip}", max_attempts=8)

    if not bool(current_user.two_factor_enabled):
        raise HTTPException(status_code=400, detail="ยังไม่ได้เปิดใช้งาน 2FA สำหรับบัญชีนี้")

    _verify_user_second_factor(current_user, payload.code, allow_backup=False)
    plaintext_codes, hashed_json = totp_service.generate_backup_codes()
    current_user.totp_backup_codes = hashed_json
    db.add(current_user)
    db.commit()

    return {
        "backup_codes": plaintext_codes,
        "backup_codes_remaining": len(plaintext_codes),
    }


@router.post("/2fa/disable")
def disable_two_factor(
    payload: schema.TwoFactorDisableRequest,
    request: Request,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Disable 2FA after verifying both account password and a live TOTP/backup code."""
    client_ip = _get_client_ip(request)
    _check_rate_limit(f"2fa-disable:{current_user.id}:{client_ip}", max_attempts=8)

    if not bool(current_user.two_factor_enabled):
        raise HTTPException(status_code=400, detail="บัญชีนี้ไม่ได้เปิดใช้งาน 2FA")
    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="รหัสผ่านปัจจุบันไม่ถูกต้อง")

    _verify_user_second_factor(current_user, payload.code, allow_backup=True)

    current_user.two_factor_enabled = 0
    current_user.totp_secret_enc = None
    current_user.totp_pending_secret_enc = None
    current_user.totp_backup_codes = None
    current_user.totp_last_used_step = None
    current_user.two_factor_enabled_at = None
    db.add(current_user)
    db.commit()

    return {
        "enabled": False,
        "backup_codes_remaining": 0,
        "detail": "ปิดการใช้งานการยืนยันตัวตน 2 ชั้นเรียบร้อยแล้ว",
    }


@router.get("/admin/users", response_model=list[schema.UserResponse])
def get_all_users(
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Admin only: list all registered users."""
    return db.query(models.User).order_by(models.User.id.asc()).all()


def _sanitize_csv_cell(val: object) -> object:
    """Prevent CSV Formula Injection (DDE/Excel formula execution) when opening exported CSVs."""
    if isinstance(val, str) and val and val[0] in ("=", "+", "-", "@", "\t", "\r"):
        return f"'{val}"
    return val


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
        writer.writerow([
            u.id,
            _sanitize_csv_cell(u.email),
            _sanitize_csv_cell(u.username),
            _sanitize_csv_cell(u.role),
            reg_date,
        ])

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=registered_users.csv"},
    )