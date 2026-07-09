from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional, List


class AnalyticsResponse(BaseModel):
    id: int
    date: date
    
    # Request metrics
    total_requests: int
    successful_requests: int
    failed_requests: int
    
    # Token metrics
    input_tokens: int
    output_tokens: int
    total_tokens: int
    
    # Cost metrics
    total_cost: float
    estimated_savings: float
    
    # Cache metrics
    cache_hits: int
    cache_misses: int
    cache_hit_rate: float
    
    # Performance metrics
    average_latency_ms: float
    
    # Model usage
    gpt4_usage: int
    gpt35_usage: int
    gemini_usage: int
    groq_usage: int
    ollama_usage: int
    
    # Other
    carbon_footprint_kg: float
    
    class Config:
        from_attributes = True


class AnalyticsSummaryResponse(BaseModel):
    period: str  # "7_days", "30_days", "90_days", "all_time"
    total_requests: int
    total_tokens: int
    total_cost: float
    estimated_savings: float
    average_cache_hit_rate: float
    average_latency_ms: float
    daily_metrics: List[AnalyticsResponse]
