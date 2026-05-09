from datetime import datetime
from typing import Optional

from beanie import Document
from pydantic import Field


class Resume(Document):
    """Parsed resume linked to an interview session."""
    session_id: str
    filename: Optional[str] = None
    content_text: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "resumes"
