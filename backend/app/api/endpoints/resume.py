from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.resume_service import resume_service

router = APIRouter()


@router.post("/upload")
async def upload_resume(
    session_id: str = Form(...),
    file: UploadFile = File(...)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    try:
        content_text = await resume_service.process_resume(session_id, file)
        return {
            "status": "success",
            "message": "Resume uploaded and parsed successfully.",
            "extracted_text_preview": content_text[:200] + "..." if content_text else ""
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process resume: {str(e)}")
