import json
import logging
import os
import shutil
import traceback
import uuid
from typing import List, Dict, Any, Optional

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from app.schemas.interview import (
    StartInterviewRequest, InterviewResponse,
    AnswerRequest, FeedbackResponse, EndInterviewRequest,
)
from app.services.llm_service import llm_service
from app.services.session_service import session_service
from app.services.stt_service import stt_service

logger = logging.getLogger(__name__)

router = APIRouter()


def aggregate_non_verbal_stats(interaction_log: list) -> Optional[dict]:
    """Extract average non-verbal metrics from the interaction log."""
    total_eye = 0
    total_stability = 0
    count = 0
    for entry in interaction_log:
        metrics = entry.get("metrics")
        if metrics:
            total_eye += metrics.get("eye_contact_score", 0)
            total_stability += metrics.get("head_stability_score", 0)
            count += 1

    if count == 0:
        return None

    return {
        "avg_eye_contact": round(total_eye / count, 1),
        "avg_head_stability": round(total_stability / count, 1),
        "details": f"Measured over {count} responses.",
    }


@router.post("/start", response_model=InterviewResponse)
async def start_interview(request: StartInterviewRequest):
    session_id = str(uuid.uuid4())
    await session_service.create_session(session_id, request.role, request.difficulty)

    question = await llm_service.generate_question(
        request.role, request.difficulty, "General", []
    )
    await session_service.add_history(session_id, "ai", question)

    return InterviewResponse(session_id=session_id, message=question)


@router.get("/history", response_model=List[Dict[str, Any]])
async def get_interview_history():
    return await session_service.get_all_sessions()


@router.post("/chat", response_model=FeedbackResponse)
async def chat_interview(request: AnswerRequest):
    session = await session_service.get_session(request.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    await session_service.add_history(request.session_id, "user", request.answer)

    current_state = await session_service.get_state(request.session_id)
    if not current_state:
        current_state = {
            "current_stage": "technical_deep_dive",
            "question_count": 0,
            "dynamic_difficulty": session["difficulty"],
            "topics_covered": [],
            "performance_profile": {
                "strong_areas": [], "weak_areas": [], "critical_mistakes": []
            },
            "next_focus": "Continue interview",
            "interaction_log": [],
        }

    current_state.setdefault("interaction_log", []).append({
        "role": "user",
        "content": request.answer,
        "metrics": request.non_verbal_metrics,
    })

    # Find last AI question
    last_question = "Question not found"
    for item in reversed(session["history"]):
        if item["role"] == "ai":
            last_question = item["content"]
            break

    # Evaluate answer
    evaluation = await llm_service.evaluate_answer_v2(
        role=session["role"],
        difficulty=current_state.get("dynamic_difficulty", session["difficulty"]),
        stage=current_state.get("current_stage", "technical_deep_dive"),
        q_count=current_state.get("question_count", 0),
        weak_areas=current_state["performance_profile"]["weak_areas"],
        strong_areas=current_state["performance_profile"]["strong_areas"],
        question=last_question,
        answer=request.answer,
    )

    current_state["question_count"] = current_state.get("question_count", 0) + 1

    if evaluation.get("score"):
        await session_service.update_last_answer_score(
            request.session_id, float(evaluation["score"])
        )

    if evaluation.get("critical_mistake"):
        current_state["performance_profile"]["critical_mistakes"].append(
            evaluation["critical_mistake"]
        )

    # Dynamic difficulty adjustment
    difficulty_map = {"easy": 1, "medium": 2, "hard": 3}
    reverse_map = {1: "easy", 2: "medium", 3: "hard"}
    diff_val = difficulty_map.get(
        current_state.get("dynamic_difficulty", session["difficulty"]), 2
    )
    difficulty_trend = evaluation.get("difficulty_trend", "stable").lower()

    if difficulty_trend == "upgrade" and diff_val < 3:
        diff_val += 1
    elif difficulty_trend == "downgrade" and diff_val > 1:
        diff_val -= 1

    current_state["dynamic_difficulty"] = reverse_map.get(diff_val, "medium")
    current_state["next_focus"] = evaluation.get("next_focus", "Continue")

    if evaluation.get("stage_change"):
        current_state["current_stage"] = evaluation["stage_change"]

    await session_service.update_state(request.session_id, current_state)

    # Check for interview end
    if evaluation.get("end_interview") or current_state["question_count"] >= 10:
        avg_score = await session_service.get_average_score(request.session_id)
        non_verbal_stats = aggregate_non_verbal_stats(
            current_state.get("interaction_log", [])
        )

        final_feedback = await llm_service.generate_final_feedback(
            role=session["role"],
            difficulty_history=current_state.get("dynamic_difficulty", session["difficulty"]),
            question_count=current_state["question_count"],
            strong_areas=current_state["performance_profile"]["strong_areas"],
            weak_areas=current_state["performance_profile"]["weak_areas"],
            recent_critical_mistakes=current_state["performance_profile"]["critical_mistakes"],
            average_score=avg_score,
            non_verbal_stats=non_verbal_stats,
        )

        await session_service.complete_session(
            request.session_id, json.dumps(final_feedback)
        )

        return FeedbackResponse(
            feedback=f"Interview Completed. Final Verdict: {final_feedback.get('final_verdict')}",
            is_completed=True,
            final_feedback_data=final_feedback,
        )

    # Generate next question
    next_question = await llm_service.generate_question_v2(
        role=session["role"],
        difficulty=current_state.get("dynamic_difficulty", session["difficulty"]),
        stage=current_state.get("current_stage", "technical"),
        weak_areas=current_state["performance_profile"]["weak_areas"],
        strong_areas=current_state["performance_profile"]["strong_areas"],
        directive=current_state["next_focus"],
    )

    await session_service.add_history(request.session_id, "ai", next_question)

    feedback_text = f"Score: {evaluation.get('score')}/10. {evaluation.get('next_focus')}"
    return FeedbackResponse(
        feedback=feedback_text, next_question=next_question, is_completed=False
    )


@router.post("/audio-chat", response_model=FeedbackResponse)
async def audio_chat_interview(
    session_id: str = Form(...),
    audio_file: UploadFile = File(...),
    non_verbal_metrics: Optional[str] = Form(None),
):
    temp_filename = f"temp_{uuid.uuid4()}.webm"
    temp_path = os.path.join(os.getcwd(), temp_filename)

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(audio_file.file, buffer)

    try:
        try:
            transcribed_text = stt_service.transcribe(temp_path)
        except Exception as e:
            logger.error("Transcription failed", exc_info=True)
            raise HTTPException(
                status_code=500, detail=f"Transcription failed: {str(e)}"
            )

        if not transcribed_text:
            raise HTTPException(
                status_code=400, detail="Could not transcribe audio. Text is empty."
            )

        metrics_dict = None
        if non_verbal_metrics:
            try:
                metrics_dict = json.loads(non_verbal_metrics)
            except Exception:
                logger.warning("Failed to parse non_verbal_metrics")

        request = AnswerRequest(
            session_id=session_id,
            answer=transcribed_text,
            non_verbal_metrics=metrics_dict,
        )
        return await chat_interview(request)

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Audio chat processing error", exc_info=True)
        raise HTTPException(
            status_code=500, detail=f"Internal Processing Error: {str(e)}"
        )
    finally:
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except OSError:
                pass


@router.post("/end", response_model=FeedbackResponse)
async def end_interview(request: EndInterviewRequest):
    session = await session_service.get_session(request.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    current_state = await session_service.get_state(request.session_id)
    if not current_state:
        current_state = {
            "current_stage": "technical_deep_dive",
            "question_count": 0,
            "dynamic_difficulty": session["difficulty"],
            "topics_covered": [],
            "performance_profile": {
                "strong_areas": [], "weak_areas": [], "critical_mistakes": []
            },
            "next_focus": "Continue interview",
            "interaction_log": [],
        }

    avg_score = await session_service.get_average_score(request.session_id)
    non_verbal_stats = aggregate_non_verbal_stats(
        current_state.get("interaction_log", [])
    )

    final_feedback = await llm_service.generate_final_feedback(
        role=session["role"],
        difficulty_history=current_state.get("dynamic_difficulty", session["difficulty"]),
        question_count=current_state.get("question_count", 0),
        strong_areas=current_state["performance_profile"]["strong_areas"],
        weak_areas=current_state["performance_profile"]["weak_areas"],
        recent_critical_mistakes=current_state["performance_profile"]["critical_mistakes"],
        average_score=avg_score,
        non_verbal_stats=non_verbal_stats,
    )

    await session_service.complete_session(
        request.session_id, json.dumps(final_feedback)
    )

    return FeedbackResponse(
        feedback=f"Interview Ended Manually. Final Verdict: {final_feedback.get('final_verdict')}",
        is_completed=True,
        final_feedback_data=final_feedback,
    )
