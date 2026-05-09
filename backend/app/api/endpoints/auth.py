from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from app.api import deps
from app.core import security
from app.core.config import settings
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.schemas.token import Token

router = APIRouter()


@router.post("/register", response_model=Token)
async def register(user_in: UserCreate) -> Any:
    """Register a new user and return a JWT access token."""
    existing = await User.find_one(User.email == user_in.email)
    if existing:
        raise HTTPException(
            status_code=400,
            detail="A user with this email already exists.",
        )
    user = User(
        email=user_in.email,
        hashed_password=security.get_password_hash(user_in.password),
    )
    await user.insert()
    access_token = security.create_access_token(
        subject=str(user.id),
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login", response_model=Token)
async def login(user_in: UserLogin) -> Any:
    """Authenticate user credentials and return a JWT access token."""
    user = await User.find_one(User.email == user_in.email)
    if not user or not security.verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=400,
            detail="Incorrect email or password",
        )
    access_token = security.create_access_token(
        subject=str(user.id),
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(deps.get_current_user)) -> Any:
    """Return the currently authenticated user's profile."""
    return UserResponse(id=str(current_user.id), email=current_user.email)
