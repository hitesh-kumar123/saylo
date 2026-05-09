from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.session import init_db
from app.api.endpoints import interview, auth, resume


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Connect to MongoDB and initialise Beanie on startup."""
    await init_db()
    yield
    # (Motor handles connection cleanup automatically on process exit)


app = FastAPI(
    title="SayLO AI Backend",
    version="1.0.0",
    description="AI Interview Simulator Backend powered by FastAPI + MongoDB",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
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
app.include_router(resume.router, prefix="/api/resume", tags=["resume"])


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "app": "SayLO Backend",
        "version": "1.0.0",
        "database": "MongoDB",
    }


@app.get("/")
async def root():
    return {"message": "Welcome to SayLO AI Backend"}
