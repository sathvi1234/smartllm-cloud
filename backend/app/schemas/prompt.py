from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class PromptCreate(BaseModel):
    project_id: int
    system_prompt: Optional[str] = None
    user_prompt: str
    model: str
    temperature: float = Field(default=0.7, ge=0, le=2)
    max_tokens: int = Field(default=2000, ge=1, le=4000)


class PromptResponse(BaseModel):
    id: int
    user_id: int
    project_id: int
    system_prompt: Optional[str]
    user_prompt: str
    model: str
    temperature: float
    max_tokens: int
    input_tokens: int
    output_tokens: int
    total_tokens: int
    estimated_cost: float
    quality_score: Optional[float]
    cached: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class ResponseCreate(BaseModel):
    content: str
    tokens_used: int
    latency_ms: float
    success: bool = True
    error_message: Optional[str] = None


class ResponseResponse(BaseModel):
    id: int
    prompt_id: int
    model: str
    content: str
    tokens_used: int
    latency_ms: float
    success: int
    error_message: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


class PlaygroundRequest(BaseModel):
    system_prompt: Optional[str] = None
    user_prompt: str
    model: str
    temperature: float = Field(default=0.7, ge=0, le=2)
    max_tokens: int = Field(default=2000, ge=1, le=4000)
    project_id: Optional[int] = None


class PlaygroundResponse(BaseModel):
    response: str
    input_tokens: int
    output_tokens: int
    total_tokens: int
    estimated_cost: float
    latency_ms: float
    model: str
    cached: bool = False
