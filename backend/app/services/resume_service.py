import logging
import os
import shutil
import uuid

from pypdf import PdfReader
from fastapi import UploadFile

from app.models.resume import Resume

logger = logging.getLogger(__name__)


class ResumeService:
    def __init__(self):
        self.upload_dir = "uploads/resumes"
        os.makedirs(self.upload_dir, exist_ok=True)

    async def process_resume(self, session_id: str, file: UploadFile) -> str:
        """Save the uploaded PDF, extract its text, and persist to MongoDB."""
        file_extension = file.filename.split(".")[-1]
        unique_filename = f"{session_id}_{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(self.upload_dir, unique_filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        content_text = ""
        try:
            reader = PdfReader(file_path)
            for page in reader.pages:
                content_text += page.extract_text() + "\n"
        except Exception as e:
            logger.error("Error reading PDF: %s", e)
            content_text = "Error extracting text from PDF."

        # Upsert: update if a resume for this session already exists
        existing = await Resume.find_one(Resume.session_id == session_id)
        if existing:
            existing.filename = file.filename
            existing.content_text = content_text
            await existing.save()
        else:
            new_resume = Resume(
                session_id=session_id,
                filename=file.filename,
                content_text=content_text,
            )
            await new_resume.insert()

        return content_text


resume_service = ResumeService()
