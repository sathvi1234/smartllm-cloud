from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class APIKeyCreate(BaseModel):
    project_id: int
    name: str = Field(..., min_length=1, max_length=255)


class APIKeyResponse(BaseModel):
    id: int
    name: str
    key: Optional[str] = None  # Only returned on creation
    total_requests: int
    total_tokens: int
    is_active: bool
    created_at: datetime
    last_used_at: Optional[datetime]
    expires_at: Optional[datetime]
    
    class Config:
        from_attributes = True
