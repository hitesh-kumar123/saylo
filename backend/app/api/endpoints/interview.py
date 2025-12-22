from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.schemas.interview import StartInterviewRequest, InterviewResponse, AnswerRequest, FeedbackResponse
from app.services.llm_service import llm_service
from app.services.session_service import session_service
import uuid

router = APIRouter()

@router.post("/start", response_model=InterviewResponse)
async def start_interview(request: StartInterviewRequest):
    session_id = str(uuid.uuid4())
    session_service.create_session(session_id, request.role, request.difficulty)
    
    # Generate first question
    question = await llm_service.generate_question(request.role, request.difficulty, "General", [])
    session_service.add_history(session_id, "ai", question)
    
    return InterviewResponse(session_id=session_id, message=question)

@router.get("/history", response_model=List[Dict[str, Any]])
async def get_interview_history():
    return session_service.get_all_sessions()

@router.post("/chat", response_model=FeedbackResponse)
async def chat_interview(request: AnswerRequest):
    session = session_service.get_session(request.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session_service.add_history(request.session_id, "user", request.answer)
    
    # Simple logic: 5 questions total
    if len(session["history"]) >= 10: # 5 Q + 5 A
        session_service.complete_session(request.session_id, "Interview Completed")
        return FeedbackResponse(feedback="Interview Completed. Thank you!", is_completed=True)
        
    # Generate next question
    # In reality, this should be based on the user's answer
    next_question = await llm_service.generate_question(
        session["role"], 
        session["difficulty"], 
        "Technical", 
        [m["content"] for m in session["history"] if m["role"] == "ai"]
    )
    
    session_service.add_history(request.session_id, "ai", next_question)
    
    return FeedbackResponse(feedback="Good answer", next_question=next_question, is_completed=False)
