import pytest
from app.services.session_service import SessionService
from app.db.session import init_db


@pytest.fixture(autouse=True)
async def setup_db(anyio_backend):
    await init_db()



class TestSessionService:
    def setup_method(self):
        self.service = SessionService()

    @pytest.mark.anyio
    async def test_get_nonexistent_session(self):
        result = await self.service.get_session("nonexistent-id-12345")
        assert result is None

    @pytest.mark.anyio
    async def test_get_state_nonexistent_session(self):
        result = await self.service.get_state("nonexistent-id-12345")
        assert result is None

    @pytest.mark.anyio
    async def test_get_average_score_no_data(self):
        result = await self.service.get_average_score("nonexistent-id-12345")
        assert result == 0.0

    @pytest.mark.anyio
    async def test_get_all_sessions(self):
        result = await self.service.get_all_sessions()
        assert isinstance(result, list)

