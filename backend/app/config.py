from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings from environment variables"""
    
    # API Settings
    API_TITLE: str = "SmartLLM Cloud API"
    API_VERSION: str = "1.0.0"
    API_DESCRIPTION: str = "AI Cost & Token Optimization Platform API"
    DEBUG: bool = True
    
    # Database - SQLite for development, PostgreSQL for production
    DATABASE_URL: str = "sqlite:///./smartllm.db"
    DATABASE_ECHO: bool = False
    
    # JWT
    SECRET_KEY: str = "dev-secret-key-change-in-production-smartllm-2024"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:3001", "http://localhost:8000", "http://127.0.0.1:3000"]
    
    # Redis (optional, for caching)
    REDIS_URL: Optional[str] = None
    
    # AI Provider Keys
    OPENAI_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    GROQ_API_KEY: Optional[str] = None
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    
    # Stripe (optional)
    STRIPE_API_KEY: Optional[str] = None
    STRIPE_WEBHOOK_SECRET: Optional[str] = None
    
    # Email (optional)
    SMTP_SERVER: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
