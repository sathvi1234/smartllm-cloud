from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class ProjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    status: Optional[str] = "active"


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None


class ProjectResponse(ProjectBase):
    id: int
    owner_id: int
    total_requests: int
    total_tokens_used: int
    total_cost: float
    monthly_cost: float
    cache_hit_rate: float
    is_archived: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ProjectDetailResponse(ProjectResponse):
    api_keys_count: int = 0
    total_prompts: int = 0
