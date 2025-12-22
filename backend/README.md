# SayLO AI Backend

## 🚀 How to Run

### Option 1: One-Click (Windows)
Double-click `run_server.bat` in this folder.

### Option 2: Manual (Terminal)
1. Open terminal in `backend` folder.
2. Activate Virtual Environment:
   ```powershell
   .\venv\Scripts\activate
   ```
3. Run Server:
   ```powershell
   python -m uvicorn app.main:app --reload
   ```

## 🛠 Features
- **FastAPI** running on `http://localhost:8000`
- **Swagger Docs**: `http://localhost:8000/docs`
- **AI Model**: Llama 3.2 (Local via `llama-cpp-python`)
