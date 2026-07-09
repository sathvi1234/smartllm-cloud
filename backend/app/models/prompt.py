from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base


class Prompt(Base):
    """Prompt model for storing user prompts"""
    __tablename__ = "prompts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    system_prompt = Column(Text, nullable=True)
    user_prompt = Column(Text, nullable=False)
    model = Column(String, nullable=False)  # gpt-4, gemini-2.5-pro, etc.
    temperature = Column(Float, default=0.7)
    max_tokens = Column(Integer, default=2000)
    input_tokens = Column(Integer, default=0)
    output_tokens = Column(Integer, default=0)
    total_tokens = Column(Integer, default=0)
    estimated_cost = Column(Float, default=0.0)
    quality_score = Column(Float, nullable=True)
    cached = Column(Integer, default=0)  # 0 = no cache, 1 = cache hit
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="prompts")
    project = relationship("Project", back_populates="prompts")
    response = relationship("Response", back_populates="prompt", uselist=False, cascade="all, delete-orphan")


class Response(Base):
    """Response model for storing API responses"""
    __tablename__ = "responses"
    
    id = Column(Integer, primary_key=True, index=True)
    prompt_id = Column(Integer, ForeignKey("prompts.id"), nullable=False, unique=True)
    model = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    tokens_used = Column(Integer, default=0)
    latency_ms = Column(Float, default=0.0)
    success = Column(Integer, default=1)  # 1 = success, 0 = failed
    error_message = Column(String, nullable=True)
    metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    prompt = relationship("Prompt", back_populates="response")
