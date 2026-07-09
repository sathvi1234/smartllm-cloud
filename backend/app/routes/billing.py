from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import select

from app.database import get_db
from app.schemas.billing import BillingPlanResponse, InvoiceResponse
from app.models import BillingPlan, Invoice

router = APIRouter()


@router.get("/plan", response_model=BillingPlanResponse)
async def get_billing_plan(user_id: int = 1, db: AsyncSession = Depends(get_db)):
    """Get user's billing plan"""
    query = select(BillingPlan).where(BillingPlan.user_id == user_id)
    result = await db.execute(query)
    plan = result.scalar_one_or_none()
    
    if not plan:
        # Create default free plan
        plan = BillingPlan(user_id=user_id, plan_type="free")
        db.add(plan)
        await db.commit()
        await db.refresh(plan)
    
    return plan


@router.post("/upgrade")
async def upgrade_plan(plan_type: str = "pro", user_id: int = 1, db: AsyncSession = Depends(get_db)):
    """Upgrade billing plan"""
    query = select(BillingPlan).where(BillingPlan.user_id == user_id)
    result = await db.execute(query)
    plan = result.scalar_one_or_none()
    
    if not plan:
        plan = BillingPlan(user_id=user_id)
        db.add(plan)
    
    # Update plan based on type
    plan_configs = {
        "free": {"monthly_cost": 0.0, "api_requests_limit": 1000, "tokens_limit": None},
        "pro": {"monthly_cost": 29.0, "api_requests_limit": 30000, "tokens_limit": None, "cache_enabled": True, "analytics_enabled": True},
        "enterprise": {"monthly_cost": 299.0, "api_requests_limit": None, "tokens_limit": None, "cache_enabled": True, "analytics_enabled": True, "support_level": "premium"},
    }
    
    if plan_type in plan_configs:
        config = plan_configs[plan_type]
        for key, value in config.items():
            setattr(plan, key, value)
        plan.plan_type = plan_type
    
    await db.commit()
    await db.refresh(plan)
    return plan


@router.get("/invoices", response_model=list[InvoiceResponse])
async def get_invoices(user_id: int = 1, db: AsyncSession = Depends(get_db)):
    """Get user's invoices"""
    query = select(Invoice).join(BillingPlan).where(BillingPlan.user_id == user_id)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/usage")
async def get_usage(user_id: int = 1, db: AsyncSession = Depends(get_db)):
    """Get current usage statistics"""
    query = select(BillingPlan).where(BillingPlan.user_id == user_id)
    result = await db.execute(query)
    plan = result.scalar_one_or_none()
    
    if not plan:
        return {"error": "Plan not found"}
    
    return {
        "plan_type": plan.plan_type,
        "api_requests_limit": plan.api_requests_limit,
        "tokens_limit": plan.tokens_limit,
        "concurrent_requests": plan.concurrent_requests,
        "features": {
            "cache": plan.cache_enabled,
            "analytics": plan.analytics_enabled,
            "support": plan.support_level,
        }
    }
