from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.endpoints import interview, auth

app = FastAPI(
    title="SayLO AI Backend",
    version="1.0.0",
    description="AI Interview Simulator Backend powered by FastAPI",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(interview.router, prefix="/api/interview", tags=["interview"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])

@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "app": "SayLO Backend",
        "version": "1.0.0"
    }

@app.get("/")
async def root():
    return {"message": "Welcome to SayLO AI Backend"}
