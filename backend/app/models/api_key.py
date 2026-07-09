from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
import secrets
from .base import Base


class APIKey(Base):
    """API Key model for project access"""
    __tablename__ = "api_keys"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    key = Column(String, unique=True, index=True, nullable=False)
    key_hash = Column(String, nullable=False)  # Hashed for security
    name = Column(String, nullable=False)
    total_requests = Column(Integer, default=0)
    total_tokens = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    last_used_at = Column(DateTime, nullable=True)
    expires_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="api_keys")
    project = relationship("Project", back_populates="api_keys")
    
    @staticmethod
    def generate_key() -> str:
        """Generate a secure API key"""
        return f"sk_{secrets.token_urlsafe(32)}"
