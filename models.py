from sqlalchemy import Column, Integer, String, ForeignKey, Text, UniqueConstraint
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
    image_path = Column(String, nullable=True)

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

    session = relationship("ExamSession", back_populates="answers")
    question = relationship("Question")


class UserQuestionStat(Base):
    __tablename__ = "user_question_stats"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)

    # Spaced Repetition fields (SuperMemo-2 style)
    repetitions = Column(Integer, default=0, nullable=False)
    interval = Column(Integer, default=0, nullable=False)  # days
    ease_factor = Column(Integer, default=250, nullable=False)  # 2.5 represented as 250
    next_review_date = Column(Integer, nullable=False)  # Unix timestamp

    user = relationship("User")
    question = relationship("Question")


class ReportedQuestion(Base):
    __tablename__ = "reported_questions"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    issue_type = Column(String, nullable=False)
    description = Column(String, nullable=True)
    status = Column(String, default="pending")
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
    note_text = Column(Text, nullable=False, default="")
    updated_at = Column(Integer, nullable=False)  # Unix timestamp

    user = relationship("User")
    question = relationship("Question")