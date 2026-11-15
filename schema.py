from enum import Enum
from pydantic import BaseModel, Field
from typing import List, Optional

class ClinicalCategory(str, Enum):
    ORAL_DIAGNOSIS_AND_ORAL_MEDICINE = "วิทยาการวินิจฉัยและเวชศาสตร์ช่องปาก"
    OCCLUSION_AND_OROFACIAL_PAIN = "ทันตกรรมบดเคี้ยวและอาการปวดบริเวณช่องปากและใบหน้า"
    ORAL_SURGERY = "ศัลยศาสตร์ช่องปาก"
    PERIODONTICS = "ปริทันตวิทยา"
    RESTORATIVE_OPERATIVE_DENTISTRY = "ทันตกรรมบูรณะ/หัตถการ"
    ENDODONTICS = "วิทยาเอ็นโดดอนต์"
    PROSTHODONTICS = "ทันตกรรมประดิษฐ์"
    ORTHODONTICS = "ทันตกรรมจัดฟัน"
    PEDIATRIC_DENTISTRY = "ทันตกรรมสำหรับเด็ก"
    COMMUNITY_DENTISTRY = "ทันตกรรมชุมชน"
    LAW_AND_ETHICS = "กฎหมายและจรรยาบรรณ"

class ProfessionalTask(str, Enum):
    HEALTH_PROMOTION_AND_PREVENTION = "การสร้างเสริมสุขภาพและการป้องกัน"
    MECHANISM_OF_DISEASES = "การเกิดและการดำเนินโรค"
    DATA_GATHERING_AND_DIAGNOSIS = "การวินิจฉัยโรค"
    PATIENT_MANAGEMENT_AND_TREATMENT = "การจัดการและการรักษาผู้ป่วย"
    PROCEDURES = "ขั้นตอนและวิธีการรักษา"
    LAW_ACT = "พ.ร.บ. วิชาชีพทันตกรรม พ.ศ. 2537"
    LAW_ETHICS = "จรรยาบรรณแห่งวิชาชีพทันตกรรม"
    LAW_CLINIC = "พ.ร.บ. สถานพยาบาล พ.ศ. 2541"
    LAW_OTHER = "กฎหมายอื่นๆ ที่เกี่ยวข้อง"

class ExamChoice(BaseModel):
    label: str = Field(description="The choice letter (e.g., A, B, C, D, E)")
    text: str = Field(description="The text content of the choice")

class ExamQuestion(BaseModel):
    question_text: str = Field(description="The full text of the question")
    choices: List[ExamChoice] = Field(description="List of choices for the question")
    correct_answer: Optional[str] = Field(default=None, description="The correct choice label, if known")
    category: ClinicalCategory = Field(description="The clinical category this question belongs to")
    task: ProfessionalTask = Field(description="The professional task this question relates to")
    explanation: Optional[str] = Field(default=None, description="Detailed explanation for the answer, if available")
    image_paths: List[str] = Field(default_factory=list, description="List of associated image file paths, if any")
    source_exam: Optional[str] = Field(default=None, description="The source exam file or identifier")
    stem: Optional[str] = Field(default=None, description="Case stem (patient scenario) separated from the proposition")
    proposition: Optional[str] = Field(default=None, description="The sub-question / proposition separated from the stem")

class ExamBank(BaseModel):
    questions: List[ExamQuestion] = Field(description="List of all extracted exam questions")

# --- Auth & User Schemas ---
from pydantic import BaseModel, Field, EmailStr, field_validator
import re

class UserCreate(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร')
        if not any(char.isupper() for char in v):
            raise ValueError('รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว (A-Z)')
        if not any(char.islower() for char in v):
            raise ValueError('รหัสผ่านต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว (a-z)')
        if not any(char.isdigit() for char in v):
            raise ValueError('รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว (0-9)')
        if not any(char in '!@#$%^&*()-_=+[]{}|;:,.<>?/~`' for char in v):
            raise ValueError('รหัสผ่านต้องมีอักขระพิเศษอย่างน้อย 1 ตัว (เช่น !@#$%^&*...)')
        # Block extremely common passwords
        _COMMON_PASSWORDS = {
            'password', 'password123', '12345678', 'qwerty123',
            'adminadmin', 'letmein12', 'welcome123', 'changeme',
        }
        if v.lower() in _COMMON_PASSWORDS:
            raise ValueError('รหัสผ่านนี้คาดเดาได้ง่ายเกินไป กรุณาตั้งรหัสผ่านใหม่ที่ปลอดภัยขึ้น')
        return v

class UserLogin(BaseModel):
    email: str = Field(..., description="Email or Username")
    password: str

    @field_validator('email')
    @classmethod
    def strip_identifier(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError('กรุณากรอกอีเมลหรือชื่อผู้ใช้งาน')
        return v

_LEGACY_SESSION_LABELS = {
    "NL 1/2570": "ครั้งที่ 1 ปี 2570",
    "ครั้งที่ 1/2570": "ครั้งที่ 1 ปี 2570",
    "NL 2/2570": "ครั้งที่ 2 ปี 2570",
    "ครั้งที่ 2/2570": "ครั้งที่ 2 ปี 2570",
}


def normalize_exam_session_label(value: Optional[str]) -> Optional[str]:
    if value is None:
        return "ครั้งที่ 1 ปี 2570"
    trimmed = value.strip()
    if not trimmed:
        return "ครั้งที่ 1 ปี 2570"
    return _LEGACY_SESSION_LABELS.get(trimmed, trimmed)


class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    created_at: int
    role: str = "user"
    display_name: Optional[str] = None
    dental_school: Optional[str] = None
    academic_year: Optional[str] = None
    target_exam_session: Optional[str] = "ครั้งที่ 1 ปี 2570"
    target_score_pct: Optional[int] = 75
    daily_goal_questions: Optional[int] = 20
    subscription_tier: str = "early_access"
    subscription_status: str = "active"
    subscription_expires_at: Optional[int] = None
    two_factor_enabled: bool = False
    two_factor_backup_remaining: int = 0
    two_factor_enabled_at: Optional[int] = None
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None

    @field_validator("target_exam_session", mode="before")
    @classmethod
    def _normalize_target_exam_session(cls, v):
        return normalize_exam_session_label(v)


class UserProfileUpdate(BaseModel):
    username: Optional[str] = Field(default=None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None
    display_name: Optional[str] = Field(default=None, max_length=80)
    dental_school: Optional[str] = Field(default=None, max_length=120)
    academic_year: Optional[str] = Field(default=None, max_length=60)
    target_exam_session: Optional[str] = Field(default=None, max_length=60)
    target_score_pct: Optional[int] = Field(default=None, ge=50, le=100)
    daily_goal_questions: Optional[int] = Field(default=None, ge=5, le=200)

    @field_validator("target_exam_session", mode="before")
    @classmethod
    def _normalize_update_target_exam_session(cls, v):
        return None if v is None else normalize_exam_session_label(v)


class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str

    @field_validator('new_password')
    @classmethod
    def validate_new_password(cls, v):
        return UserCreate.validate_password(v)

class Token(BaseModel):
    access_token: Optional[str] = None
    token_type: str = "bearer"
    refresh_token: Optional[str] = None
    requires_2fa: bool = False
    challenge_token: Optional[str] = None


class TwoFactorVerifyLoginRequest(BaseModel):
    challenge_token: str
    code: str = Field(..., min_length=4, max_length=24)


class TwoFactorCodeConfirmRequest(BaseModel):
    code: str = Field(..., min_length=4, max_length=24)


class TwoFactorDisableRequest(BaseModel):
    current_password: str = Field(..., min_length=1)
    code: str = Field(..., min_length=4, max_length=24)

# --- Tracking Schemas ---
class UserAnswerCreate(BaseModel):
    question_id: int
    selected_choice: Optional[str] = Field(default=None, max_length=20)
    is_correct: bool
    time_spent_seconds: Optional[int] = None  # per-question timing
    confidence: Optional[str] = Field(default=None, max_length=20)  # 'confident' | 'unsure' | 'hard'


class CardReviewSubmit(BaseModel):
    card_key: str = Field(..., min_length=1, max_length=200)
    card_type: str = Field(default="flashcard", pattern="^(flashcard|topic|cloze)$")
    rating: Optional[int] = Field(default=None, ge=1, le=4)
    mastery_status: Optional[str] = Field(default=None, max_length=32)


class CardReviewSyncItem(BaseModel):
    card_key: str = Field(..., min_length=1, max_length=200)
    card_type: str = Field(default="flashcard", pattern="^(flashcard|topic|cloze)$")
    mastery_status: str = Field(..., min_length=1, max_length=32)


class CardReviewSyncBatch(BaseModel):
    items: List[CardReviewSyncItem] = Field(default_factory=list, max_length=1000)


class CardReviewOut(BaseModel):
    card_key: str
    card_type: str
    repetitions: int
    interval: int
    ease_factor: int
    last_quality: Optional[int] = None
    lapse_count: int = 0
    mastery_status: str
    next_review_date: int
    updated_at: int
    days_until_due: int = 0
    is_due: bool = False

class ExamSessionCreate(BaseModel):
    start_time: int
    end_time: int
    exam_type: str = Field(..., min_length=1, max_length=50)
    score: Optional[int]
    total_questions: int
    time_limit_seconds: Optional[int] = None  # NULL = untimed practice mode
    time_spent_seconds: Optional[int] = None
    answers: List[UserAnswerCreate] = Field(default_factory=list, max_length=500)

class ExamSessionResponse(BaseModel):
    id: int
    start_time: int
    end_time: Optional[int]
    exam_type: str
    score: Optional[int]
    total_questions: int
    time_limit_seconds: Optional[int] = None
    time_spent_seconds: Optional[int] = None

# --- Bookmark Schemas ---
class BookmarkCreate(BaseModel):
    question_id: int

class BookmarkResponse(BaseModel):
    id: int
    question_id: int
    created_at: int

    class Config:
        from_attributes = True

# --- User Note Schemas ---
class UserNoteUpsert(BaseModel):
    question_id: Optional[int] = None
    topic_id: Optional[str] = None
    mistake_tag: Optional[str] = Field(default=None, max_length=60)
    note_text: str = Field(default="", max_length=8000)
    append: bool = False

class UserNoteResponse(BaseModel):
    id: int
    question_id: Optional[int] = None
    topic_id: Optional[str] = None
    mistake_tag: Optional[str] = None
    note_text: str
    updated_at: int

    class Config:
        from_attributes = True
