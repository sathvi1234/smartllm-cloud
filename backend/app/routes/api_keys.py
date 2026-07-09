from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import select
import secrets

from app.database import get_db
from app.schemas.api_key import APIKeyCreate, APIKeyResponse
from app.models import APIKey
from app.utils import hash_password, ResourceNotFound

router = APIRouter()


@router.post("", response_model=APIKeyResponse)
async def create_api_key(api_key: APIKeyCreate, user_id: int = 1, db: AsyncSession = Depends(get_db)):
    """Create a new API key"""
    key = APIKey.generate_key()
    
    db_key = APIKey(
        user_id=user_id,
        project_id=api_key.project_id,
        key=key,
        key_hash=hash_password(key),
        name=api_key.name,
    )
    db.add(db_key)
    await db.commit()
    await db.refresh(db_key)
    
    # Return with unhashed key (only time it's visible)
    response_data = {
        **{k: v for k, v in db_key.__dict__.items() if not k.startswith('_')},
        "key": key,
    }
    return APIKeyResponse(**response_data)


@router.get("", response_model=list[APIKeyResponse])
async def list_api_keys(user_id: int = 1, db: AsyncSession = Depends(get_db)):
    """List API keys for user"""
    query = select(APIKey).where(APIKey.user_id == user_id)
    result = await db.execute(query)
    keys = result.scalars().all()
    
    # Don't return actual keys
    return [
        APIKeyResponse(**{k: v for k, v in key.__dict__.items() if k != 'key_hash' and not k.startswith('_')})
        for key in keys
    ]


@router.delete("/{key_id}")
async def delete_api_key(key_id: int, user_id: int = 1, db: AsyncSession = Depends(get_db)):
    """Delete an API key"""
    query = select(APIKey).where(APIKey.id == key_id, APIKey.user_id == user_id)
    result = await db.execute(query)
    api_key = result.scalar_one_or_none()
    
    if not api_key:
        raise ResourceNotFound("API Key")
    
    await db.delete(api_key)
    await db.commit()
    return {"message": "API key deleted"}
