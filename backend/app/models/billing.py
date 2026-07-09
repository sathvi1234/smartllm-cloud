from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base


class BillingPlan(Base):
    """Billing plan model"""
    __tablename__ = "billing_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    plan_type = Column(String, default="free")  # free, pro, enterprise
    monthly_cost = Column(Float, default=0.0)
    api_requests_limit = Column(Integer, default=1000)
    tokens_limit = Column(Integer, nullable=True)  # None = unlimited
    concurrent_requests = Column(Integer, default=10)
    cache_enabled = Column(Boolean, default=False)
    analytics_enabled = Column(Boolean, default=False)
    support_level = Column(String, default="community")  # community, priority, premium
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    renewal_date = Column(DateTime, nullable=True)
    canceled_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="billing_plan")
    invoices = relationship("Invoice", back_populates="billing_plan", cascade="all, delete-orphan")


class Invoice(Base):
    """Invoice model for billing"""
    __tablename__ = "invoices"
    
    id = Column(Integer, primary_key=True, index=True)
    billing_plan_id = Column(Integer, ForeignKey("billing_plans.id"), nullable=False)
    invoice_number = Column(String, unique=True, nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="USD")
    status = Column(String, default="pending")  # pending, paid, failed, refunded
    period_start = Column(DateTime, nullable=False)
    period_end = Column(DateTime, nullable=False)
    due_date = Column(DateTime, nullable=False)
    paid_date = Column(DateTime, nullable=True)
    stripe_invoice_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    billing_plan = relationship("BillingPlan", back_populates="invoices")
