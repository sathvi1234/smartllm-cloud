from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.analytics_service import AnalyticsService

router = APIRouter()


@router.get("/summary")
async def get_summary(period: str = "30_days", user_id: int = 1, project_id: int = None, db: AsyncSession = Depends(get_db)):
    """Get analytics summary"""
    return await AnalyticsService.get_summary_stats(db, user_id, period)


@router.get("/daily")
async def get_daily(user_id: int = 1, project_id: int = None, db: AsyncSession = Depends(get_db)):
    """Get daily analytics"""
    return await AnalyticsService.get_daily_metrics(db, user_id, project_id)


@router.get("/models")
async def get_model_usage(user_id: int = 1, db: AsyncSession = Depends(get_db)):
    """Get model usage statistics"""
    return await AnalyticsService.get_model_usage(db, user_id)


@router.get("/costs")
async def get_costs(user_id: int = 1, db: AsyncSession = Depends(get_db)):
    """Get cost breakdown"""
    return await AnalyticsService.get_cost_breakdown(db, user_id)
