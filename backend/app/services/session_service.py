import json
from datetime import datetime
from typing import Optional, List, Dict, Any

from app.models.interview import Interview, Question, Answer, InterviewStatus


class SessionService:
    """
    Manages interview sessions persisted in MongoDB via Beanie.
    All methods are async — call them with `await`.
    """

    # ── Create ──────────────────────────────────────────────────────────────

    async def create_session(self, session_id: str, role: str, difficulty: str) -> None:
        """Create a new interview document in MongoDB."""
        initial_state: Dict[str, Any] = {
            "current_stage": "technical_deep_dive",
            "question_count": 0,
            "dynamic_difficulty": difficulty,
            "topics_covered": [],
            "performance_profile": {
                "strong_areas": [],
                "weak_areas": [],
                "critical_mistakes": [],
            },
            "next_focus": "Start the interview",
            "interaction_log": [],
        }
        interview = Interview(
            session_id=session_id,
            role=role,
            difficulty=difficulty,
            status=InterviewStatus.IN_PROGRESS,
            current_state=initial_state,
        )
        await interview.insert()

    # ── Read ─────────────────────────────────────────────────────────────────

    async def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Return a session dict (compatible with the existing endpoint API)."""
        interview = await Interview.find_one(Interview.session_id == session_id)
        if not interview:
            return None

        # Rebuild a flat history list: [ai question, user answer, ai question, …]
        history: List[Dict[str, str]] = []
        for q in sorted(interview.questions, key=lambda x: x.order):
            history.append({"role": "ai", "content": q.content})
            if q.answer:
                history.append({"role": "user", "content": q.answer.content})

        return {
            "id": interview.session_id,
            "role": interview.role,
            "difficulty": interview.difficulty,
            "history": history,
            "start_time": interview.start_time.isoformat() if interview.start_time else None,
            "end_time": interview.end_time.isoformat() if interview.end_time else None,
            "feedback": interview.overall_feedback,
            "current_state": interview.current_state or {},
        }

    async def get_state(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Return the current dynamic state dict for a session."""
        interview = await Interview.find_one(Interview.session_id == session_id)
        if interview:
            return interview.current_state
        return None

    async def get_all_sessions(self) -> List[Dict[str, Any]]:
        """Return a summary list of all interviews, newest first."""
        interviews = await Interview.find_all().sort(-Interview.start_time).to_list()
        return [
            {
                "id": i.session_id,
                "role": i.role,
                "difficulty": i.difficulty,
                "start_time": i.start_time.isoformat() if i.start_time else None,
                "end_time": i.end_time.isoformat() if i.end_time else None,
                "feedback": i.overall_feedback,
            }
            for i in interviews
        ]

    # ── Update ───────────────────────────────────────────────────────────────

    async def update_state(self, session_id: str, new_state: Dict[str, Any]) -> None:
        """Persist an updated state dict back to MongoDB."""
        interview = await Interview.find_one(Interview.session_id == session_id)
        if interview:
            interview.current_state = new_state
            await interview.save()

    async def add_history(self, session_id: str, role: str, content: str) -> None:
        """
        Add an AI question or a user answer to the interview's embedded list.
        - role == "ai"   → append a new Question
        - role == "user" → set the Answer on the latest unanswered Question
        """
        interview = await Interview.find_one(Interview.session_id == session_id)
        if not interview:
            return

        if role == "ai":
            new_order = len(interview.questions) + 1
            interview.questions.append(
                Question(content=content, order=new_order)
            )
        elif role == "user":
            # Find the latest question that has no answer yet
            for q in reversed(interview.questions):
                if q.answer is None:
                    q.answer = Answer(content=content)
                    break

        await interview.save()

    async def update_last_answer_score(self, session_id: str, score: float) -> None:
        """Set the AI score on the most recently answered question."""
        interview = await Interview.find_one(Interview.session_id == session_id)
        if not interview:
            return
        # Walk in reverse to find the last answered question
        for q in reversed(interview.questions):
            if q.answer is not None:
                q.answer.ai_score = score
                break
        await interview.save()

    async def complete_session(self, session_id: str, feedback: str) -> None:
        """Mark the interview as completed and store final feedback."""
        interview = await Interview.find_one(Interview.session_id == session_id)
        if interview:
            interview.end_time = datetime.utcnow()
            interview.overall_feedback = feedback
            interview.status = InterviewStatus.COMPLETED
            await interview.save()

    async def get_average_score(self, session_id: str) -> float:
        """Compute the average AI score across all answered questions."""
        interview = await Interview.find_one(Interview.session_id == session_id)
        if not interview:
            return 0.0

        scores = [
            q.answer.ai_score
            for q in interview.questions
            if q.answer and q.answer.ai_score is not None
        ]
        if not scores:
            return 0.0
        return round(sum(scores) / len(scores), 1)


session_service = SessionService()
