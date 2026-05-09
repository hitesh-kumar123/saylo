from pydantic import BaseModel
from typing import Optional, Dict, Any


class StartInterviewRequest(BaseModel):
    role: str
    difficulty: str
    topic: str = "General"


class InterviewResponse(BaseModel):
    session_id: str
    message: str  # The first question


class AnswerRequest(BaseModel):
    session_id: str
    answer: str
    non_verbal_metrics: Optional[Dict[str, Any]] = None


class EndInterviewRequest(BaseModel):
    session_id: str


class FeedbackResponse(BaseModel):
    feedback: str
    next_question: Optional[str] = None
    is_completed: bool = False
    final_feedback_data: Optional[Dict[str, Any]] = None  # Full Gemini feedback JSON on completion
