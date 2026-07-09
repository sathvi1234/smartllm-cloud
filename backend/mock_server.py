#!/usr/bin/env python3
"""
Simple mock backend server for testing frontend integration
"""
from fastapi import FastAPI, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
import json

app = FastAPI(title="SmartLLM Cloud Mock API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class UserRegister(BaseModel):
    email: str
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    avatar: Optional[str] = None
    created_at: Optional[str] = None

class TokenResponse(BaseModel):
    token: str
    user: UserResponse

# Mock data
MOCK_USER = UserResponse(
    id=1,
    email="demo@smartllm.ai",
    full_name="Demo User",
    avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=demo@smartllm.ai"
)

MOCK_TOKEN = "mock_jwt_token_here"

# Health check
@app.get("/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}

@app.get("/")
async def root():
    return {
        "message": "SmartLLM Cloud Mock API",
        "version": "1.0.0",
        "docs": "/docs",
    }

# Authentication endpoints
@app.post("/api/auth/register", response_model=UserResponse)
async def register(user: UserRegister):
    return UserResponse(
        id=1,
        email=user.email,
        full_name=user.full_name,
        avatar=f"https://api.dicebear.com/7.x/avataaars/svg?seed={user.email}"
    )

@app.post("/api/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    if credentials.email == "demo@smartllm.ai" and credentials.password == "demo123":
        return TokenResponse(token=MOCK_TOKEN, user=MOCK_USER)
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/api/auth/me", response_model=UserResponse)
async def get_me(authorization: Optional[str] = Header(None)):
    if not authorization or "Bearer" not in authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return MOCK_USER

# Projects endpoints
@app.get("/api/projects")
async def list_projects(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return [
        {
            "id": 1,
            "name": "E-commerce Platform",
            "description": "AI product recommendations",
            "status": "active",
            "created_at": "2024-01-15T10:00:00",
            "requests": 12500,
            "monthly_cost": 125.50,
            "cache_hit_rate": 32.5,
            "api_key": "sk_proj_1234567890",
        },
        {
            "id": 2,
            "name": "Content Generation",
            "description": "Automated blog posts",
            "status": "active",
            "created_at": "2024-02-20T14:30:00",
            "requests": 8900,
            "monthly_cost": 89.75,
            "cache_hit_rate": 28.3,
            "api_key": "sk_proj_0987654321",
        },
        {
            "id": 3,
            "name": "Data Analysis",
            "description": "Intelligent insights",
            "status": "active",
            "created_at": "2024-03-10T09:15:00",
            "requests": 6327,
            "monthly_cost": 78.25,
            "cache_hit_rate": 24.1,
            "api_key": "sk_proj_1122334455",
        },
    ]

# Analytics endpoints
@app.get("/api/analytics/summary")
async def analytics_summary(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return {
        "total_requests": 28727,
        "total_tokens": 15200000,
        "total_cost": 533.55,
        "money_saved": 287.42,
        "cache_hits": 28.4,
        "models_used": 12,
        "avg_latency": 542,
        "carbon_footprint": 12.4,
    }

@app.get("/api/analytics/daily")
async def analytics_daily(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    data = []
    for i in range(7):
        date = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
        data.append({
            "date": date,
            "requests": 4000 + (i * 200),
            "cost": 80 + (i * 5),
            "tokens": 2000000 + (i * 100000),
        })
    return {"data": data}

# API Keys endpoints
@app.get("/api/api-keys")
async def list_api_keys(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return [
        {
            "id": 1,
            "name": "Main API Key",
            "key": "sk_live_1234567890abcdef",
            "created_at": "2024-01-10",
            "last_used": "2024-01-09T15:30:00",
            "requests": 25000,
            "rate_limit": "1000/min",
        },
        {
            "id": 2,
            "name": "Development Key",
            "key": "sk_test_0987654321fedcba",
            "created_at": "2024-01-05",
            "last_used": "2024-01-08T12:15:00",
            "requests": 3727,
            "rate_limit": "100/min",
        },
    ]

# Billing endpoints
@app.get("/api/billing/plan")
async def billing_plan(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return {
        "plan_name": "Pro",
        "plan_id": "pro_monthly",
        "status": "active",
        "monthly_cost": 29.00,
        "renewal_date": "2024-08-01",
        "billing_cycle": "monthly",
        "api_requests_limit": 30000,
        "api_requests_used": 28727,
        "tokens_limit": None,
        "tokens_used": 15200000,
    }

# Settings endpoints
@app.get("/api/settings/profile")
async def get_profile(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return {
        "id": 1,
        "email": "demo@smartllm.ai",
        "full_name": "Demo User",
        "avatar": MOCK_USER.avatar,
        "phone": "+1 (555) 123-4567",
        "timezone": "America/New_York",
        "language": "English",
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Mock Backend Server...")
    print("📍 http://localhost:8000")
    print("📚 Swagger UI: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
