from datetime import datetime
from typing import Optional, List
import enum

from beanie import Document
from pydantic import BaseModel, Field


class InterviewStatus(str, enum.Enum):
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"


# ── Embedded sub-documents ──────────────────────────────────────────────────

class Answer(BaseModel):
    """Embedded answer for a question."""
    content: str
    audio_url: Optional[str] = None
    ai_feedback: Optional[str] = None
    ai_score: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Question(BaseModel):
    """Embedded question with an optional answer."""
    content: str
    order: int
    created_at: datetime = Field(default_factory=datetime.utcnow)
    answer: Optional[Answer] = None


# ── Top-level MongoDB document ──────────────────────────────────────────────

class Interview(Document):
    """
    One interview session. Questions and answers are embedded directly
    instead of being separate collections — idiomatic MongoDB design.
    """
    session_id: str                          # UUID string (set by endpoint)
    user_id: Optional[str] = None           # Auth user id (ObjectId string)
    role: str
    difficulty: str
    topic: Optional[str] = "General"
    status: InterviewStatus = InterviewStatus.IN_PROGRESS
    current_state: Optional[dict] = None    # Dynamic interview state blob
    questions: List[Question] = []
    start_time: datetime = Field(default_factory=datetime.utcnow)
    end_time: Optional[datetime] = None
    overall_feedback: Optional[str] = None

    class Settings:
        name = "interviews"
