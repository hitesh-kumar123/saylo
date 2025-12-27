# SayLO — AI Interview Simulator

SayLO is an open-source interview preparation platform that focuses on privacy and local-first AI processing. It provides simulated interviews, resume parsing, video interviews (via Jitsi), and performance analytics.

Clean, modular architecture with separated frontend and backend.

## Quick Links

- **Frontend**: `frontend/src/main.tsx`
- **Backend**: `backend/app/main.py`
- **Frontend Dev**: `cd frontend && npm run dev`
- **Backend Dev**: `cd backend && run_server.bat`

## Table of contents

1. Features
2. Getting started (dev & production)
3. Environment variables
4. Testing
5. Project structure
6. Ollama (optional) and AI
7. Contributing
8. Troubleshooting

---

## 1. Features

- Local-first AI interview simulations (optional Ollama integration)
- Resume parsing (client-side PDF processing)
- Jitsi-based video interviews
- Session storage using IndexedDB / Dexie
- Performance metrics and analytics

## 2. Getting started

Prerequisites

- Node.js v18+ (Node 20 recommended)
- Python 3.10+
- npm (or pnpm/yarn)

Clone

```powershell
git clone https://github.com/hitesh-kumar123/saylo.git
cd saylo
```

Install

**Frontend:**

```powershell
cd frontend
npm install
```

**Backend:**

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

Run locally (two terminals)

- Terminal A — start backend:

```powershell
cd backend
run_server.bat
```

- Terminal B — start frontend:

```powershell
cd frontend
npm run dev
```

Open http://localhost:5173 in browser. Backend API runs at `http://localhost:3001/api`.

Production build

```powershell
npm run build
npm run preview
```

Notes

- The repository doesn't run a single combined process by default. Running frontend and backend in separate shells is the simplest local workflow.

## 3. Environment variables

Create a backend `.env` at project root and a frontend `.env.local` in the root for Vite variables.

Backend (`.env`)

```
PORT=3001
JWT_SECRET=your_jwt_secret_here
FRONTEND_ORIGIN=http://localhost:5173
```

Frontend (`.env.local`)

```
VITE_API_URL=http://localhost:3001/api
VITE_JITSI_DOMAIN=meet.jit.si
VITE_OLLAMA_HOST=http://localhost:11434
VITE_OLLAMA_MODEL=llama3.2:3b
```

Tip: Vite only exposes variables prefixed with `VITE_` to client code.

## 4. Testing

Frontend tests with Vitest:

```powershell
npm test              # Watch mode
npm run test:run      # Single run
npm run test:ui       # UI dashboard
npm run test:coverage # Coverage report
```

Test files: `frontend/test/`

## Project Structure

```
saylo/
├── frontend/                  # React + TypeScript frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API & utility services
│   │   ├── store/             # Zustand state management
│   │   └── types/             # TypeScript types
│   └── package.json
│
├── backend/                   # Python FastAPI
│   ├── app/                   # App source
│   │   ├── main.py            # Main entry point
│   │   ├── api/               # API endpoints
│   │   ├── core/              # Config & security
│   │   ├── db/                # Database setup
│   │   ├── models/            # SQLAlchemy models
│   │   ├── schemas/           # Pydantic schemas
│   │   └── services/          # Business logic
│   ├── alembic/               # Database migrations
│   ├── requirements.txt       # Python dependencies
│   └── run_server.bat         # Start script
│
├── docs/                      # Documentation
├── test/                      # Frontend tests
└── package.json               # Root package config
```

## 6. Ollama (optional) — local LLM

SayLO can integrate with Ollama to provide richer AI question generation and analysis. Ollama is optional — SayLO has fallback logic when Ollama is not available.

Basic steps (high level):

1. Install Ollama (download from https://ollama.ai or use the platform installer).
2. Run `ollama serve` (default port `11434`).
3. Pull a model, e.g. `ollama pull llama3.2:3b`.
4. Configure `VITE_OLLAMA_HOST` and `VITE_OLLAMA_MODEL` in `.env.local`.

See `OLLAMA_SETUP.md` for a more detailed guide and troubleshooting tips.

## 7. Contributing

Small contribution guidelines are in `docs/CONTRIBUTING.md`. In short:

- Fork and use feature branches
- Run tests and linters before opening a PR
- Add tests for new functionality
- Use clear, small commits

## 8. Troubleshooting

- If resume upload / parsing fails: check browser console for PDF.js worker errors and ensure the file is a valid PDF.
- If video (Jitsi) fails to connect: verify browser camera/microphone permissions and that `VITE_JITSI_DOMAIN` is reachable.
- If AI features are missing: either Ollama isn't running or the configured model isn't available (`ollama list`).

If you encounter environment-specific issues, open an issue with a short reproduction and logs.

---

If you'd like, I can also:

- Add a `docs/` folder with a short Developer Setup and Contributing guide (I already added `docs/CONTRIBUTING.md`).
- Add a small `README` badge summary and a short architecture diagram in `docs/ARCHITECTURE.md`.

Done — updated documentation to be accurate, concise and actionable.
