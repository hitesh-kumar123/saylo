import pytest
from app.services.session_service import SessionService


class TestSessionService:
    def setup_method(self):
        self.service = SessionService()

    def test_get_nonexistent_session(self):
        result = self.service.get_session("nonexistent-id-12345")
        assert result is None

    def test_get_state_nonexistent_session(self):
        result = self.service.get_state("nonexistent-id-12345")
        assert result is None

    def test_get_average_score_no_data(self):
        result = self.service.get_average_score("nonexistent-id-12345")
        assert result == 0.0

    def test_get_all_sessions(self):
        result = self.service.get_all_sessions()
        assert isinstance(result, list)
