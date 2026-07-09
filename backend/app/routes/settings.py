from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import select

from app.database import get_db
from app.models import User
from app.schemas.user import UserResponse, UserUpdate
from app.utils import ResourceNotFound

router = APIRouter()


@router.get("/profile", response_model=UserResponse)
async def get_profile(user_id: int = 1, db: AsyncSession = Depends(get_db)):
    """Get user profile"""
    query = select(User).where(User.id == user_id)
    result = await db.execute(query)
    user = result.scalar_one_or_none()
    
    if not user:
        raise ResourceNotFound("User")
    
    return user


@router.put("/profile", response_model=UserResponse)
async def update_profile(user_update: UserUpdate, user_id: int = 1, db: AsyncSession = Depends(get_db)):
    """Update user profile"""
    query = select(User).where(User.id == user_id)
    result = await db.execute(query)
    user = result.scalar_one_or_none()
    
    if not user:
        raise ResourceNotFound("User")
    
    for key, value in user_update.dict(exclude_unset=True).items():
        setattr(user, key, value)
    
    await db.commit()
    await db.refresh(user)
    return user


@router.get("/preferences")
async def get_preferences(user_id: int = 1):
    """Get user preferences"""
    return {
        "theme": "dark",
        "notifications": True,
        "email_updates": True,
        "language": "en",
    }


@router.put("/preferences")
async def update_preferences(preferences: dict, user_id: int = 1):
    """Update user preferences"""
    # This would update preferences in a preferences table or JSON column
    return preferences


@router.get("/api-providers")
async def get_api_providers():
    """Get connected API providers"""
    return {
        "openai": False,
        "gemini": False,
        "groq": False,
        "ollama": True,
    }


@router.post("/api-providers/{provider}")
async def connect_provider(provider: str, api_key: str, user_id: int = 1):
    """Connect API provider"""
    # This would validate and store the API key
    return {"message": f"Successfully connected {provider}"}


@router.post("/change-password")
async def change_password(old_password: str, new_password: str, user_id: int = 1, db: AsyncSession = Depends(get_db)):
    """Change user password"""
    query = select(User).where(User.id == user_id)
    result = await db.execute(query)
    user = result.scalar_one_or_none()
    
    if not user:
        raise ResourceNotFound("User")
    
    # Verify old password
    from app.utils import verify_password, hash_password
    if not verify_password(old_password, user.hashed_password):
        return {"error": "Invalid current password"}
    
    # Update password
    user.hashed_password = hash_password(new_password)
    await db.commit()
    
    return {"message": "Password changed successfully"}
