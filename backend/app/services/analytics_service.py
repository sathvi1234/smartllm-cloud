from typing import Dict, Any, List
from datetime import datetime, timedelta, date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, and_
from sqlalchemy.orm import select

from app.models import Analytics, Prompt, Response, Project


class AnalyticsService:
    """Service for analytics aggregation and reporting"""
    
    @staticmethod
    async def get_daily_metrics(
        db: AsyncSession, 
        user_id: int,
        project_id: int = None,
        start_date: date = None,
        end_date: date = None,
    ) -> List[Dict[str, Any]]:
        """Get daily analytics metrics"""
        
        if not start_date:
            start_date = date.today() - timedelta(days=30)
        if not end_date:
            end_date = date.today()
        
        query = select(Analytics).where(
            and_(
                Analytics.user_id == user_id,
                Analytics.date >= start_date,
                Analytics.date <= end_date,
            )
        )
        
        if project_id:
            query = query.where(Analytics.project_id == project_id)
        
        result = await db.execute(query)
        analytics = result.scalars().all()
        
        return [
            {
                "date": a.date,
                "total_requests": a.total_requests,
                "total_cost": a.total_cost,
                "tokens_used": a.total_tokens,
                "cache_hit_rate": a.cache_hit_rate,
                "average_latency": a.average_latency_ms,
            }
            for a in analytics
        ]
    
    @staticmethod
    async def get_summary_stats(
        db: AsyncSession,
        user_id: int,
        period: str = "30_days",
    ) -> Dict[str, Any]:
        """Get summary statistics for a time period"""
        
        if period == "7_days":
            start_date = date.today() - timedelta(days=7)
        elif period == "30_days":
            start_date = date.today() - timedelta(days=30)
        elif period == "90_days":
            start_date = date.today() - timedelta(days=90)
        else:  # all_time
            start_date = date(2020, 1, 1)
        
        query = select(
            func.sum(Analytics.total_requests).label("total_requests"),
            func.sum(Analytics.total_tokens).label("total_tokens"),
            func.sum(Analytics.total_cost).label("total_cost"),
            func.sum(Analytics.estimated_savings).label("estimated_savings"),
            func.avg(Analytics.cache_hit_rate).label("avg_cache_hit_rate"),
            func.avg(Analytics.average_latency_ms).label("avg_latency_ms"),
        ).where(
            and_(
                Analytics.user_id == user_id,
                Analytics.date >= start_date,
            )
        )
        
        result = await db.execute(query)
        row = result.first()
        
        return {
            "period": period,
            "total_requests": row[0] or 0,
            "total_tokens": row[1] or 0,
            "total_cost": float(row[2]) if row[2] else 0.0,
            "estimated_savings": float(row[3]) if row[3] else 0.0,
            "average_cache_hit_rate": float(row[4]) if row[4] else 0.0,
            "average_latency_ms": float(row[5]) if row[5] else 0.0,
        }
    
    @staticmethod
    async def get_model_usage(
        db: AsyncSession,
        user_id: int,
        days: int = 30,
    ) -> Dict[str, int]:
        """Get model usage statistics"""
        
        start_date = date.today() - timedelta(days=days)
        
        query = select(
            func.sum(Analytics.gpt4_usage).label("gpt4"),
            func.sum(Analytics.gpt35_usage).label("gpt35"),
            func.sum(Analytics.gemini_usage).label("gemini"),
            func.sum(Analytics.groq_usage).label("groq"),
            func.sum(Analytics.ollama_usage).label("ollama"),
        ).where(
            and_(
                Analytics.user_id == user_id,
                Analytics.date >= start_date,
            )
        )
        
        result = await db.execute(query)
        row = result.first()
        
        return {
            "gpt4": row[0] or 0,
            "gpt3.5": row[1] or 0,
            "gemini": row[2] or 0,
            "groq": row[3] or 0,
            "ollama": row[4] or 0,
        }
    
    @staticmethod
    async def get_cost_breakdown(
        db: AsyncSession,
        user_id: int,
        project_id: int = None,
    ) -> Dict[str, Any]:
        """Get detailed cost breakdown"""
        
        query = select(
            func.sum(Analytics.total_cost).label("total_cost"),
            func.count(Analytics.id).label("days"),
        ).where(Analytics.user_id == user_id)
        
        if project_id:
            query = query.where(Analytics.project_id == project_id)
        
        result = await db.execute(query)
        row = result.first()
        
        total_cost = float(row[0]) if row[0] else 0.0
        days = row[1] or 1
        avg_daily_cost = total_cost / days
        
        return {
            "total_cost": total_cost,
            "average_daily_cost": avg_daily_cost,
            "projected_monthly_cost": avg_daily_cost * 30,
            "projected_annual_cost": avg_daily_cost * 365,
        }
    
    @staticmethod
    async def create_or_update_daily_metrics(
        db: AsyncSession,
        user_id: int,
        project_id: int,
        metrics: Dict[str, Any],
    ) -> Analytics:
        """Create or update daily analytics metrics"""
        
        today = date.today()
        
        query = select(Analytics).where(
            and_(
                Analytics.user_id == user_id,
                Analytics.project_id == project_id,
                Analytics.date == today,
            )
        )
        
        result = await db.execute(query)
        analytics = result.scalar_one_or_none()
        
        if analytics:
            # Update existing
            for key, value in metrics.items():
                if hasattr(analytics, key):
                    setattr(analytics, key, value)
        else:
            # Create new
            analytics = Analytics(
                user_id=user_id,
                project_id=project_id,
                date=today,
                **metrics,
            )
            db.add(analytics)
        
        await db.commit()
        return analytics
