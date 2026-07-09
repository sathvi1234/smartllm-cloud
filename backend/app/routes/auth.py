from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import select
from datetime import timedelta

from app.database import get_db
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse
from app.models import User
from app.utils import hash_password, verify_password, create_access_token, verify_token, InvalidCredentials, ConflictError

router = APIRouter()


@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    """Register a new user"""
    
    # Check if user already exists
    query = select(User).where(User.email == user.email)
    result = await db.execute(query)
    if result.scalar_one_or_none():
        raise ConflictError("Email already registered")
    
    # Create new user
    db_user = User(
        email=user.email,
        full_name=user.full_name,
        hashed_password=hash_password(user.password),
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    
    return db_user


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    """Login user"""
    
    # Find user by email
    query = select(User).where(User.email == credentials.email)
    result = await db.execute(query)
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise InvalidCredentials()
    
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User is inactive")
    
    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires,
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": 30 * 60,
    }


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    token: str = None,
    db: AsyncSession = Depends(get_db),
):
    """Get current authenticated user"""
    
    if not token:
        raise InvalidCredentials("No token provided")
    
    # Verify token
    try:
        payload = verify_token(token)
        user_id = int(payload.get("sub"))
    except Exception:
        raise InvalidCredentials()
    
    # Get user
    query = select(User).where(User.id == user_id)
    result = await db.execute(query)
    user = result.scalar_one_or_none()
    
    if not user:
        raise InvalidCredentials("User not found")
    
    return user


@router.post("/refresh")
async def refresh_token(token: str):
    """Refresh access token"""
    
    try:
        payload = verify_token(token)
        user_id = payload.get("sub")
    except Exception:
        raise InvalidCredentials("Invalid token")
    
    # Create new access token
    access_token = create_access_token(data={"sub": user_id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": 30 * 60,
    }


@router.post("/logout")
async def logout():
    """Logout user (client-side token deletion)"""
    return {"message": "Logged out successfully"}
