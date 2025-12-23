from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Text, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.db.base import Base
import enum

class InterviewStatus(str, enum.Enum):
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"

class Interview(Base):
    __tablename__ = "interviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # Ideally link to User, but since auth is currently local storage only, 
    # we might need to handle "Guest" or start migrating auth. 
    # For now, I will add the ForeignKey but it might fail if we don't have users.
    # The requirement said "Create minimal but correct tables", including User.
    # So I will assume we will create a user or have one.
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True) # Nullable for guest for now? Or Strict?
    # Strict is better for "correct" design.
    
    role = Column(String, nullable=False)
    difficulty = Column(String, nullable=False)
    topic = Column(String, nullable=True)
    status = Column(Enum(InterviewStatus), default=InterviewStatus.IN_PROGRESS)
    current_state = Column(Text, nullable=True) # Storing JSON as Text for broad compatibility
    start_time = Column(DateTime(timezone=True), server_default=func.now())
    end_time = Column(DateTime(timezone=True), nullable=True)
    overall_feedback = Column(Text, nullable=True)

    questions = relationship("Question", back_populates="interview", cascade="all, delete-orphan")

class Question(Base):
    __tablename__ = "questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    interview_id = Column(UUID(as_uuid=True), ForeignKey("interviews.id"), nullable=False)
    content = Column(Text, nullable=False)
    order = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    interview = relationship("Interview", back_populates="questions")
    answer = relationship("Answer", uselist=False, back_populates="question", cascade="all, delete-orphan")

class Answer(Base):
    __tablename__ = "answers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    question_id = Column(UUID(as_uuid=True), ForeignKey("questions.id"), unique=True, nullable=False)
    content = Column(Text, nullable=False)
    audio_url = Column(String, nullable=True)
    ai_feedback = Column(Text, nullable=True)
    ai_score = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    question = relationship("Question", back_populates="answer")
