from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any, Optional
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
    
    # --- Adaptive Logic V2 ---
    current_state = session_service.get_state(request.session_id)
    if not current_state:
         # Fallback default if missing
         current_state = {
            "current_stage": "technical_deep_dive",
            "question_count": 0,
            "dynamic_difficulty": session["difficulty"],
            "topics_covered": [],
            "performance_profile": {"strong_areas": [], "weak_areas": [], "critical_mistakes": []},
            "next_focus": "Continue interview",
            "interaction_log": []
        }

    # Store interaction with metrics
    current_state.setdefault("interaction_log", []).append({
        "role": "user",
        "content": request.answer,
        "metrics": request.non_verbal_metrics
    })

    # 1. Evaluate Answer
    # Find the last asked question for context
    last_question = "Question not found"
    for item in reversed(session["history"]):
        if item["role"] == "ai":
            last_question = item["content"]
            break

    evaluation = await llm_service.evaluate_answer_v2(
        role=session["role"],
        difficulty=current_state.get("dynamic_difficulty", session["difficulty"]),
        stage=current_state.get("current_stage", "technical_deep_dive"),
        q_count=current_state.get("question_count", 0),
        weak_areas=current_state["performance_profile"]["weak_areas"],
        strong_areas=current_state["performance_profile"]["strong_areas"],
        question=last_question,
        answer=request.answer
    )

    # 2. Update State based on Evaluation
    current_state["question_count"] = current_state.get("question_count", 0) + 1
    
    # Update performance profile
    if evaluation.get("classification") == "strong":
        # Add to strong areas if not present (simplified logic)
        pass 
    elif evaluation.get("classification") == "weak":
        # Add topic to weak areas
        pass

    current_state["next_focus"] = evaluation.get("next_focus", "Continue")
    
    # Check for stage change
    if evaluation.get("stage_change"):
        current_state["current_stage"] = evaluation["stage_change"]

    # Save State
    session_service.update_state(request.session_id, current_state)

    # 3. Check for Interview End
    if evaluation.get("end_interview") or current_state["question_count"] >= 10:
        # Calculate Stats
        avg_score = session_service.get_average_score(request.session_id)
        
        # Calculate Non-Verbal Stats
        non_verbal_stats = None
        if current_state.get("interaction_log"):
            total_eye = 0
            total_stability = 0
            count = 0
            for entry in current_state["interaction_log"]:
                metrics = entry.get("metrics")
                if metrics:
                    total_eye += metrics.get("eye_contact_score", 0)
                    total_stability += metrics.get("head_stability_score", 0)
                    count += 1
            
            if count > 0:
                non_verbal_stats = {
                    "avg_eye_contact": round(total_eye / count, 1),
                    "avg_head_stability": round(total_stability / count, 1),
                    "details": f"Measured over {count} responses."
                }

        # Generate Final Feedback
        final_feedback = await llm_service.generate_final_feedback(
            role=session["role"],
            difficulty_history=current_state.get("dynamic_difficulty", session["difficulty"]), # Simplified
            question_count=current_state["question_count"],
            strong_areas=current_state["performance_profile"]["strong_areas"],
            weak_areas=current_state["performance_profile"]["weak_areas"],
            recent_critical_mistakes=current_state["performance_profile"]["critical_mistakes"],
            average_score=avg_score,
            non_verbal_stats=non_verbal_stats
        )
        
        import json
        session_service.complete_session(request.session_id, json.dumps(final_feedback))
        
        return FeedbackResponse(
            feedback=f"Interview Completed. Final Verdict: {final_feedback.get('final_verdict')}", 
            is_completed=True
        )

    # 4. Generate Next Question
    next_question = await llm_service.generate_question_v2(
        role=session["role"],
        difficulty=current_state.get("dynamic_difficulty", session["difficulty"]),
        stage=current_state.get("current_stage", "technical"),
        weak_areas=current_state["performance_profile"]["weak_areas"],
        strong_areas=current_state["performance_profile"]["strong_areas"],
        directive=current_state["next_focus"]
    )
    
    session_service.add_history(request.session_id, "ai", next_question)
    
    # Construct user-facing feedback from evaluation
    # We might want to be subtle, or direct. For now, returning the evaluation score/feedback.
    feedback_text = f"Score: {evaluation.get('score')}/10. {evaluation.get('next_focus')}"

    return FeedbackResponse(feedback=feedback_text, next_question=next_question, is_completed=False)

from fastapi import UploadFile, File, Form
from app.services.stt_service import stt_service
import shutil
import os

@router.post("/audio-chat", response_model=FeedbackResponse)
async def audio_chat_interview(
    session_id: str = Form(...),
    audio_file: UploadFile = File(...),
    non_verbal_metrics: Optional[str] = Form(None)
):
    # 1. Save uploaded file temporarily
    temp_filename = f"temp_{uuid.uuid4()}.webm"
    temp_path = os.path.join(os.getcwd(), temp_filename)
    
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(audio_file.file, buffer)
        
    try:
        # 2. Transcribe
        print(f"Starting transcription for {temp_path}")
        try:
            transcribed_text = stt_service.transcribe(temp_path)
        except Exception as e:
             import traceback
             traceback.print_exc()
             raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

        print(f"Transcribed Text: {transcribed_text}")
        
        if not transcribed_text:
            raise HTTPException(status_code=400, detail="Could not transcribe audio. Text is empty.")

        # 3. Call existing chat logic
        metrics_dict = None
        if non_verbal_metrics:
            try:
                metrics_dict = json.loads(non_verbal_metrics)
            except Exception as e:
                print(f"Failed to parse non_verbal_metrics: {e}")

        request = AnswerRequest(
            session_id=session_id, 
            answer=transcribed_text,
            non_verbal_metrics=metrics_dict
        )
        print(f"Processing answer for session {session_id}")
        return await chat_interview(request)
        
    except HTTPException as he:
        raise he
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Processing Error: {str(e)}")
    finally:
        # 4. Cleanup
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except:
                pass

from app.schemas.interview import EndInterviewRequest

@router.post("/end", response_model=FeedbackResponse)
async def end_interview(request: EndInterviewRequest):
    session = session_service.get_session(request.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    current_state = session_service.get_state(request.session_id)
    if not current_state:
         # Fallback default if missing - unlikely if started
         current_state = {
            "current_stage": "technical_deep_dive",
            "question_count": 0,
            "dynamic_difficulty": session["difficulty"],
            "topics_covered": [],
            "performance_profile": {"strong_areas": [], "weak_areas": [], "critical_mistakes": []},
            "next_focus": "Continue interview",
            "interaction_log": []
        }

    # Calculate Stats
    avg_score = session_service.get_average_score(request.session_id)
    
    # Calculate Non-Verbal Stats
    non_verbal_stats = None
    if current_state.get("interaction_log"):
        total_eye = 0
        total_stability = 0
        count = 0
        for entry in current_state["interaction_log"]:
            metrics = entry.get("metrics")
            if metrics:
                total_eye += metrics.get("eye_contact_score", 0)
                total_stability += metrics.get("head_stability_score", 0)
                count += 1
        
        if count > 0:
            non_verbal_stats = {
                "avg_eye_contact": round(total_eye / count, 1),
                "avg_head_stability": round(total_stability / count, 1),
                "details": f"Measured over {count} responses."
            }

    # Generate Final Feedback
    final_feedback = await llm_service.generate_final_feedback(
        role=session["role"],
        difficulty_history=current_state.get("dynamic_difficulty", session["difficulty"]), 
        question_count=current_state.get("question_count", 0),
        strong_areas=current_state["performance_profile"]["strong_areas"],
        weak_areas=current_state["performance_profile"]["weak_areas"],
        recent_critical_mistakes=current_state["performance_profile"]["critical_mistakes"],
        average_score=avg_score,
        non_verbal_stats=non_verbal_stats
    )
    
    import json
    session_service.complete_session(request.session_id, json.dumps(final_feedback))
    
    return FeedbackResponse(
        feedback=f"Interview Ended Manually. Final Verdict: {final_feedback.get('final_verdict')}", 
        is_completed=True
    )
