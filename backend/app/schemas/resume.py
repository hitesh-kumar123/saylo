from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ResumeCreate(BaseModel):
    session_id: str
    filename: str
    content_text: str

class ResumeResponse(BaseModel):
    id: int
    session_id: str
    filename: str
    content_text: str
    created_at: datetime

    class Config:
        from_attributes = True
