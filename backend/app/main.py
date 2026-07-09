from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import init_db, close_db
from app.routes import auth, projects, prompts, analytics, api_keys, billing, settings as settings_routes

# Lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    yield
    # Shutdown
    await close_db()

# Create FastAPI app
app = FastAPI(
    title=settings.API_TITLE,
    version=settings.API_VERSION,
    description=settings.API_DESCRIPTION,
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])
app.include_router(prompts.router, prefix="/api/prompts", tags=["Prompts"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(api_keys.router, prefix="/api/api-keys", tags=["API Keys"])
app.include_router(billing.router, prefix="/api/billing", tags=["Billing"])
app.include_router(settings_routes.router, prefix="/api/settings", tags=["Settings"])

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "version": settings.API_VERSION}

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "SmartLLM Cloud API",
        "version": settings.API_VERSION,
        "docs": "/docs",
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
    )
