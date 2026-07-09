from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class BillingPlanResponse(BaseModel):
    id: int
    user_id: int
    plan_type: str  # free, pro, enterprise
    monthly_cost: float
    api_requests_limit: int
    tokens_limit: Optional[int]
    concurrent_requests: int
    cache_enabled: bool
    analytics_enabled: bool
    support_level: str
    is_active: bool
    created_at: datetime
    renewal_date: Optional[datetime]
    
    class Config:
        from_attributes = True


class InvoiceResponse(BaseModel):
    id: int
    invoice_number: str
    amount: float
    currency: str
    status: str  # pending, paid, failed, refunded
    period_start: datetime
    period_end: datetime
    due_date: datetime
    paid_date: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True


class BillingDetailResponse(BaseModel):
    plan: BillingPlanResponse
    current_usage: dict
    invoices: List[InvoiceResponse]
    upcoming_charges: Optional[float]
