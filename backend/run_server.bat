@echo off
echo Starting SayLO AI Backend...
cd /d "%~dp0"
call venv\Scripts\activate
python -m uvicorn app.main:app --reload
pause
