from datetime import datetime
import json
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models import Interview, Question, Answer, InterviewStatus

class SessionService:
    def __init__(self):
        pass

    def get_db(self):
        return SessionLocal()

    def create_session(self, session_id: str, role: str, difficulty: str):
        db = self.get_db()
        try:
            # Prepare initial state
            initial_state = {
                "current_stage": "technical_deep_dive",
                "question_count": 0,
                "dynamic_difficulty": difficulty,
                "topics_covered": [],
                "performance_profile": {
                    "strong_areas": [],
                    "weak_areas": [],
                    "critical_mistakes": []
                },
                "next_focus": "Start the interview"
            }

            # Check if user exists? skipping for now as user api is not ready
            # Assuming guest or NULL user_id for now
            new_interview = Interview(
                id=session_id,
                role=role,
                difficulty=difficulty,
                status=InterviewStatus.IN_PROGRESS,
                current_state=json.dumps(initial_state)
            )
            db.add(new_interview)
            db.commit()
        finally:
            db.close()

    def get_session(self, session_id: str):
        db = self.get_db()
        try:
            interview = db.query(Interview).filter(Interview.id == session_id).first()
            if not interview:
                return None
            
            # Construct dictionary to match old API expectation for now
            history = []
            # Sort questions by order
            questions = sorted(interview.questions, key=lambda q: q.order)
            
            for q in questions:
                history.append({"role": "ai", "content": q.content})
                if q.answer:
                    history.append({"role": "user", "content": q.answer.content})
            
            return {
                "id": str(interview.id),
                "role": interview.role,
                "difficulty": interview.difficulty,
                "history": history,
                "start_time": interview.start_time.isoformat() if interview.start_time else None,
                "end_time": interview.end_time.isoformat() if interview.end_time else None,
                "feedback": interview.overall_feedback,
                "current_state": json.loads(interview.current_state) if interview.current_state else {}
            }
        finally:
            db.close()

    def get_state(self, session_id: str):
        db = self.get_db()
        try:
            interview = db.query(Interview).filter(Interview.id == session_id).first()
            if interview and interview.current_state:
                return json.loads(interview.current_state)
            return None
        finally:
            db.close()

    def update_state(self, session_id: str, new_state: dict):
        db = self.get_db()
        try:
            interview = db.query(Interview).filter(Interview.id == session_id).first()
            if interview:
                interview.current_state = json.dumps(new_state)
                db.commit()
        finally:
            db.close()

    def add_history(self, session_id: str, role: str, content: str):
        db = self.get_db()
        try:
            interview = db.query(Interview).filter(Interview.id == session_id).first()
            if not interview:
                return

            if role == "ai":
                # It's a question
                current_count = db.query(Question).filter(Question.interview_id == session_id).count()
                new_question = Question(
                    interview_id=session_id,
                    content=content,
                    order=current_count + 1
                )
                db.add(new_question)
            
            elif role == "user":
                # It's an answer to the LATEST question
                # Find the latest question which doesn't have an answer?
                # Or just the one with highest order
                last_question = db.query(Question)\
                    .filter(Question.interview_id == session_id)\
                    .order_by(Question.order.desc())\
                    .first()
                
                if last_question:
                    # Check if already answered?
                    if not last_question.answer:
                        new_answer = Answer(
                            question_id=last_question.id,
                            content=content
                        )
                        db.add(new_answer)
            
            db.commit()
        finally:
            db.close()

    def update_last_answer_score(self, session_id: str, score: float):
        db = self.get_db()
        try:
            # Find the latest answer for this session
            # We assume the answer was just added
            last_question = db.query(Question)\
                .filter(Question.interview_id == session_id)\
                .order_by(Question.order.desc())\
                .first()
            
            if last_question and last_question.answer:
                last_question.answer.ai_score = score
                db.commit()
        finally:
            db.close()

    def get_all_sessions(self):
        db = self.get_db()
        try:
            interviews = db.query(Interview).order_by(Interview.start_time.desc()).all()
            return [
                {
                    "id": str(i.id),
                    "role": i.role,
                    "difficulty": i.difficulty,
                    "start_time": i.start_time.isoformat() if i.start_time else None,
                    "end_time": i.end_time.isoformat() if i.end_time else None,
                    "feedback": i.overall_feedback
                }
                for i in interviews
            ]
        finally:
            db.close()

    def complete_session(self, session_id: str, feedback: str):
        db = self.get_db()
        try:
            interview = db.query(Interview).filter(Interview.id == session_id).first()
            if interview:
                interview.end_time = datetime.now()
                interview.overall_feedback = feedback
                interview.status = InterviewStatus.COMPLETED
                db.commit()
        finally:
            db.close()

    def get_average_score(self, session_id: str) -> float:
        db = self.get_db()
        try:
            # Join Interview -> Question -> Answer
            # Actually easier to just query Answers for questions in this interview
            # But we need to link Answer -> Question -> Interview
            scores = db.query(Answer.ai_score)\
                .join(Question)\
                .filter(Question.interview_id == session_id)\
                .filter(Answer.ai_score != None)\
                .all()
            
            if not scores:
                return 0.0
            
            total = sum([s[0] for s in scores])
            return round(total / len(scores), 1)
        finally:
            db.close()

session_service = SessionService()
