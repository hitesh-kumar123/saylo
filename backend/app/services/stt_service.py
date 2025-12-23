import os
from faster_whisper import WhisperModel

class STTService:
    def __init__(self):
        self.model_path = "base" # or "small"
        self.model = None
        self._setup_ffmpeg()

    def _setup_ffmpeg(self):
        # User placed ffmpeg.exe in 'models' folder
        models_ffmpeg = os.path.join(os.getcwd(), "models")
        if os.path.exists(os.path.join(models_ffmpeg, "ffmpeg.exe")):
             print(f"Found local FFmpeg at {models_ffmpeg}")
             os.environ["PATH"] += os.pathsep + models_ffmpeg
        
        # Fallback to ffmpeg folder
        local_ffmpeg = os.path.join(os.getcwd(), "ffmpeg") 
        if os.path.exists(os.path.join(local_ffmpeg, "ffmpeg.exe")):
             os.environ["PATH"] += os.pathsep + local_ffmpeg

    def load_model(self):
        if not self.model:
            print("Loading Whisper Model...")
            try:
                # device="cpu" or "cuda" if available
                self.model = WhisperModel(self.model_path, device="cpu", compute_type="int8")
                print("Whisper Model Loaded!")
            except Exception as e:
                print(f"Error loading Whisper: {e}")

    def transcribe(self, file_path: str) -> str:
        if not self.model:
            self.load_model()
        
        if not self.model:
            return "Error: Model not loaded."

        try:
            segments, info = self.model.transcribe(file_path, beam_size=5)
            text = " ".join([segment.text for segment in segments])
            return text.strip()
        except Exception as e:
            print(f"Transcription error: {e}")
            return ""

stt_service = STTService()
