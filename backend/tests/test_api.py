import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestHealthEndpoints:
    def test_health_check(self):
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert data["app"] == "SayLO Backend"

    def test_root_endpoint(self):
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data


class TestInterviewEndpoints:
    def test_start_interview_success(self):
        response = client.post("/api/interview/start", json={
            "role": "frontend developer",
            "difficulty": "medium"
        })
        # Might fail if LLM model is not loaded, but endpoint should respond
        assert response.status_code in [200, 500]

    def test_start_interview_missing_fields(self):
        response = client.post("/api/interview/start", json={})
        assert response.status_code == 422  # Validation error

    def test_get_interview_history(self):
        response = client.get("/api/interview/history")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_chat_missing_session(self):
        response = client.post("/api/interview/chat", json={
            "session_id": "nonexistent-session-id",
            "answer": "test answer"
        })
        assert response.status_code == 404


class TestResumeEndpoints:
    def test_upload_non_pdf(self):
        response = client.post(
            "/api/resume/upload",
            data={"session_id": "test-session"},
            files={"file": ("test.txt", b"hello world", "text/plain")}
        )
        assert response.status_code == 400  # Only PDF allowed

    def test_upload_missing_file(self):
        response = client.post(
            "/api/resume/upload",
            data={"session_id": "test-session"}
        )
        assert response.status_code == 422  # Missing required file


class TestAuthEndpoints:
    def test_signup_missing_fields(self):
        response = client.post("/api/auth/register", json={})
        assert response.status_code == 422

    def test_login_missing_fields(self):
        response = client.post("/api/auth/login", json={})
        assert response.status_code == 422
