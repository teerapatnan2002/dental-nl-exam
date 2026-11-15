from sqlalchemy import Column, Integer, BigInteger, String, ForeignKey, Text, UniqueConstraint, Index
from sqlalchemy.orm import relationship
from database import Base


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(Text, nullable=False)
    stem = Column(Text, nullable=True)
    proposition = Column(Text, nullable=True)
    correct_answer = Column(String, nullable=True)
    category = Column(String, index=True, nullable=False)
    task = Column(String, index=True, nullable=False)
    explanation = Column(Text, nullable=True)
    source_exam = Column(String, nullable=True)
    exam_origin = Column(String, default="real_exam", index=True, nullable=False)
    image_path = Column(String, nullable=True)
    cognitive_level = Column(String, index=True, nullable=True)
    must_know_topic = Column(String, index=True, nullable=True)

    choices = relationship("Choice", back_populates="question", cascade="all, delete-orphan")


class Choice(Base):
    __tablename__ = "choices"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    label = Column(String, nullable=False)
    text = Column(Text, nullable=False)

    question = relationship("Question", back_populates="choices")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(Integer, nullable=False)  # Unix timestamp
    role = Column(String, default="user", nullable=False)  # 'user' | 'admin'

    # Profile & Study Target metadata
    display_name = Column(String, nullable=True)
    dental_school = Column(String, nullable=True)
    academic_year = Column(String, nullable=True)
    target_exam_session = Column(String, default="ครั้งที่ 1 ปี 2570", nullable=True)
    target_score_pct = Column(Integer, default=75, nullable=True)
    daily_goal_questions = Column(Integer, default=20, nullable=True)

    # Future-ready Subscription & Entitlements metadata
    subscription_tier = Column(String, default="early_access", nullable=False)  # 'free' | 'early_access' | 'pro_monthly' | 'pro_annual'
    subscription_status = Column(String, default="active", nullable=False)  # 'active' | 'trialing' | 'past_due' | 'canceled' | 'expired'
    subscription_expires_at = Column(Integer, nullable=True)  # Unix timestamp (None = unlimited)
    billing_customer_id = Column(String, nullable=True)

    # 2-Factor Authentication (TOTP RFC 6238 + encrypted secrets + recovery codes)
    two_factor_enabled = Column(Integer, default=0, nullable=False)  # 0 = disabled, 1 = enabled
    totp_secret_enc = Column(String, nullable=True)
    totp_pending_secret_enc = Column(String, nullable=True)
    totp_backup_codes = Column(Text, nullable=True)  # JSON list of salted SHA-256 hashes
    totp_last_used_step = Column(BigInteger, nullable=True)  # Replay protection step index
    two_factor_enabled_at = Column(Integer, nullable=True)

    @property
    def two_factor_backup_remaining(self) -> int:
        if not self.totp_backup_codes:
            return 0
        try:
            import json
            parsed = json.loads(self.totp_backup_codes)
            return len(parsed) if isinstance(parsed, list) else 0
        except Exception:
            return 0

    sessions = relationship("ExamSession", back_populates="user", cascade="all, delete-orphan")


class ExamSession(Base):
    __tablename__ = "exam_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    start_time = Column(Integer, nullable=False)  # Unix timestamp
    end_time = Column(Integer, nullable=True)  # Unix timestamp
    exam_type = Column(String, nullable=False)  # 'category', 'task', 'full', 'random'
    score = Column(Integer, nullable=True)
    total_questions = Column(Integer, nullable=False)
    time_limit_seconds = Column(Integer, nullable=True)  # NULL = untimed (practice mode)
    time_spent_seconds = Column(Integer, nullable=True)  # actual time used

    user = relationship("User", back_populates="sessions")
    answers = relationship("UserAnswer", back_populates="session", cascade="all, delete-orphan")


class UserAnswer(Base):
    __tablename__ = "user_answers"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("exam_sessions.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    selected_choice = Column(String, nullable=True)
    is_correct = Column(Integer, nullable=False)  # 1 or 0
    time_spent_seconds = Column(Integer, nullable=True)  # per-question timing
    confidence = Column(String, nullable=True)  # 'confident' | 'unsure' | 'hard'

    session = relationship("ExamSession", back_populates="answers")
    question = relationship("Question")


class UserQuestionStat(Base):
    __tablename__ = "user_question_stats"
    __table_args__ = (
        Index("ix_user_qstat_user_due", "user_id", "next_review_date"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)

    # Spaced Repetition fields (SuperMemo-2 style)
    repetitions = Column(Integer, default=0, nullable=False)
    interval = Column(Integer, default=0, nullable=False)  # days
    ease_factor = Column(Integer, default=250, nullable=False)  # 2.5 represented as 250
    next_review_date = Column(Integer, nullable=False)  # Unix timestamp
    last_quality = Column(Integer, nullable=True)  # 1-5 SM-2 quality score
    lapse_count = Column(Integer, default=0, nullable=False)
    last_reviewed_at = Column(Integer, nullable=True)
    last_confidence = Column(String, nullable=True)

    user = relationship("User")
    question = relationship("Question")


class UserCardReview(Base):
    __tablename__ = "user_card_reviews"
    __table_args__ = (
        UniqueConstraint("user_id", "card_key", "card_type", name="uq_user_card_review"),
        Index("ix_user_card_reviews_user_due", "user_id", "card_type", "next_review_date"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    card_key = Column(String, nullable=False, index=True)
    card_type = Column(String, nullable=False, default="flashcard")  # 'flashcard' | 'topic' | 'cloze'
    repetitions = Column(Integer, default=0, nullable=False)
    interval = Column(Integer, default=0, nullable=False)
    ease_factor = Column(Integer, default=250, nullable=False)
    last_quality = Column(Integer, nullable=True)
    lapse_count = Column(Integer, default=0, nullable=False)
    mastery_status = Column(String, nullable=False, default="review")
    next_review_date = Column(Integer, nullable=False)
    updated_at = Column(Integer, nullable=False)

    user = relationship("User")


class ReportedQuestion(Base):
    __tablename__ = "reported_questions"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    issue_type = Column(String, nullable=False)
    description = Column(String, nullable=True)
    status = Column(String, default="pending")
    admin_reply = Column(String, nullable=True)
    created_at = Column(Integer, nullable=False)

    user = relationship("User")
    question = relationship("Question")


class Bookmark(Base):
    __tablename__ = "bookmarks"
    __table_args__ = (
        UniqueConstraint("user_id", "question_id", name="uq_bookmark_user_question"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False, index=True)
    created_at = Column(Integer, nullable=False)  # Unix timestamp

    user = relationship("User")
    question = relationship("Question")


class UserNote(Base):
    __tablename__ = "user_notes"
    __table_args__ = (
        UniqueConstraint("user_id", "question_id", name="uq_note_user_question"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False, index=True)
    topic_id = Column(String, nullable=True, index=True)
    mistake_tag = Column(String, nullable=True, index=True)
    note_text = Column(Text, nullable=False, default="")
    updated_at = Column(Integer, nullable=False)  # Unix timestamp

    user = relationship("User")
    question = relationship("Question")


class UserTopicNote(Base):
    """Personal High-Yield notes & AI Tutor takeaways saved per Must-Know Topic or Pathway."""

    __tablename__ = "user_topic_notes"
    __table_args__ = (
        UniqueConstraint("user_id", "topic_id", name="uq_topic_note_user_topic"),
        Index("ix_user_topic_notes_user_updated", "user_id", "updated_at"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    topic_id = Column(String, nullable=False, index=True)
    mistake_tag = Column(String, nullable=True, index=True)
    note_text = Column(Text, nullable=False, default="")
    updated_at = Column(Integer, nullable=False)  # Unix timestamp

    user = relationship("User")


class ActivePresence(Base):
    """Tracks active browser sessions inside the online sliding-window TTL."""

    __tablename__ = "active_presence"
    __table_args__ = (
        Index("ix_active_presence_last_seen", "last_seen_at"),
    )

    session_key = Column(String(64), primary_key=True)
    identity_key = Column(String(64), nullable=False)
    last_seen_at = Column(BigInteger, nullable=False, index=True)
