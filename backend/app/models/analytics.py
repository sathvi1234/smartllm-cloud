from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Date
from sqlalchemy.orm import relationship
from datetime import datetime, date
from .base import Base


class Analytics(Base):
    """Analytics model for tracking metrics"""
    __tablename__ = "analytics"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    date = Column(Date, default=date.today, nullable=False)
    
    # Request metrics
    total_requests = Column(Integer, default=0)
    successful_requests = Column(Integer, default=0)
    failed_requests = Column(Integer, default=0)
    
    # Token metrics
    input_tokens = Column(Integer, default=0)
    output_tokens = Column(Integer, default=0)
    total_tokens = Column(Integer, default=0)
    
    # Cost metrics
    total_cost = Column(Float, default=0.0)
    estimated_savings = Column(Float, default=0.0)
    
    # Cache metrics
    cache_hits = Column(Integer, default=0)
    cache_misses = Column(Integer, default=0)
    cache_hit_rate = Column(Float, default=0.0)
    
    # Performance metrics
    average_latency_ms = Column(Float, default=0.0)
    min_latency_ms = Column(Float, default=0.0)
    max_latency_ms = Column(Float, default=0.0)
    
    # Model usage
    gpt4_usage = Column(Integer, default=0)
    gpt35_usage = Column(Integer, default=0)
    gemini_usage = Column(Integer, default=0)
    groq_usage = Column(Integer, default=0)
    ollama_usage = Column(Integer, default=0)
    
    # Other
    carbon_footprint_kg = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="analytics")
    project = relationship("Project", back_populates="analytics")
