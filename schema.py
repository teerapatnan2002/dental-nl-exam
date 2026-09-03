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
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    created_at: int
    role: str = "user"

class Token(BaseModel):
    access_token: str
    token_type: str
    refresh_token: Optional[str] = None

# --- Tracking Schemas ---
class UserAnswerCreate(BaseModel):
    question_id: int
    selected_choice: Optional[str]
    is_correct: bool
    time_spent_seconds: Optional[int] = None  # per-question timing

class ExamSessionCreate(BaseModel):
    start_time: int
    end_time: int
    exam_type: str
    score: Optional[int]
    total_questions: int
    time_limit_seconds: Optional[int] = None  # NULL = untimed practice mode
    time_spent_seconds: Optional[int] = None
    answers: List[UserAnswerCreate]

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
    question_id: int
    note_text: str = Field(default="", max_length=5000)

class UserNoteResponse(BaseModel):
    id: int
    question_id: int
    note_text: str
    updated_at: int

    class Config:
        from_attributes = True
