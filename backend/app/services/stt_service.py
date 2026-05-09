import logging
from google import genai
from app.core.config import settings

logger = logging.getLogger(__name__)

_client = None

def _get_client():
    global _client
    if _client is None:
        _client = genai.Client(api_key=settings.GEMINI_API_KEY)
    return _client

MODEL = "gemini-2.0-flash"


class STTService:

    def transcribe(self, file_path: str) -> str:
        if not hasattr(settings, 'GEMINI_API_KEY') or not settings.GEMINI_API_KEY:
            return "Error: Gemini API Key not configured."

        uploaded_file = None
        try:
            client = _get_client()

            # Upload audio file to Gemini
            with open(file_path, "rb") as f:
                uploaded_file = client.files.upload(
                    file=f,
                    config={"mime_type": "audio/webm"},
                )
            logger.info("Uploaded audio file: %s", uploaded_file.name)

            response = client.models.generate_content(
                model=MODEL,
                contents=[
                    "Transcribe the speech in this audio file exactly as spoken. Return only the transcript.",
                    uploaded_file,
                ],
            )
            return response.text.strip()

        except Exception as e:
            logger.error("Transcription error: %s", e)
            return ""
        finally:
            if uploaded_file:
                try:
                    _get_client().files.delete(name=uploaded_file.name)
                except Exception as cleanup_err:
                    logger.error("Failed to delete remote file: %s", cleanup_err)


stt_service = STTService()
