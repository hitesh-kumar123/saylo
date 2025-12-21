class SessionService:
    def __init__(self):
        self.sessions = {}

    def create_session(self, session_id: str, role: str, difficulty: str):
        self.sessions[session_id] = {
            "id": session_id,
            "role": role,
            "difficulty": difficulty,
            "history": []
        }

    def get_session(self, session_id: str):
        return self.sessions.get(session_id)

    def add_history(self, session_id: str, role: str, content: str):
        if session_id in self.sessions:
            self.sessions[session_id]["history"].append({"role": role, "content": content})

session_service = SessionService()
