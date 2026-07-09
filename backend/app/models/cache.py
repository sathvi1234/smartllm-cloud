from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base


class SemanticCache(Base):
    """Semantic cache model for caching similar prompts"""
    __tablename__ = "semantic_cache"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    
    # Original prompt info
    original_prompt = Column(Text, nullable=False)
    model = Column(String, nullable=False)
    
    # Cached response
    cached_response = Column(Text, nullable=False)
    tokens_saved = Column(Integer, default=0)
    cost_saved = Column(Float, default=0.0)
    
    # Metadata
    embedding = Column(String, nullable=True)  # Vector embedding for similarity
    hit_count = Column(Integer, default=0)
    similarity_threshold = Column(Float, default=0.85)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    last_accessed_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)
