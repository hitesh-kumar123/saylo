from pydantic import BaseModel
from typing import List, Optional

class StartInterviewRequest(BaseModel):
    role: str
    difficulty: str
    topic: str = "General"

class InterviewResponse(BaseModel):
    session_id: str
    message: str # The question or greeting

class AnswerRequest(BaseModel):
    session_id: str
    answer: str

class FeedbackResponse(BaseModel):
    feedback: str
    next_question: Optional[str] = None
    is_completed: bool = False
