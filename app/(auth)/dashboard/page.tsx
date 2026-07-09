'use client';

import { Metadata } from 'next';
import { useEffect, useState } from 'react';
import { mockDashboardStats, mockMonthlyData, mockModelDistribution } from '@/lib/mock-data';
import { useDashboardData } from '@/lib/hooks/useData';
import { StatsCard } from '@/components/dashboard/StatsCard';
import {
  DailyRequestsChart,
  MonthlyCostChart,
  ModelDistributionChart,
  TokenUsageChart,
  CostComparisonChart,
} from '@/components/dashboard/Charts';
import {
  TrendingUp,
  Zap,
  DollarSign,
  PieChart,
  Gauge,
  Leaf,
} from 'lucide-react';

// Generate mock token usage data
const tokenData = mockMonthlyData.map((item) => ({
  month: item.month,
  tokens: item.tokens,
}));

// Generate mock cost comparison
const costComparisonData = mockMonthlyData.map((item) => ({
  month: item.month,
  cost: item.cost,
  saved: Math.round(item.cost * 0.35),
}));

export default function DashboardPage() {
  const { data: analyticsData, isLoading, error } = useDashboardData();
  
  // Use real data if available, fallback to mock data
  const stats = analyticsData ? {
    totalRequests: analyticsData.total_requests || mockDashboardStats.totalRequests,
    totalTokens: analyticsData.total_tokens || mockDashboardStats.totalTokens,
    totalCost: analyticsData.total_cost || mockDashboardStats.totalCost,
    moneySaved: analyticsData.money_saved || mockDashboardStats.moneySaved,
    cacheHitRate: analyticsData.cache_hits || mockDashboardStats.cacheHitRate,
    activeModels: analyticsData.models_used || mockDashboardStats.activeModels,
    averageLatency: analyticsData.avg_latency || mockDashboardStats.averageLatency,
    carbonFootprint: analyticsData.carbon_footprint || mockDashboardStats.carbonFootprint,
  } : mockDashboardStats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back! Here's your AI optimization summary.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Requests"
          value={stats.totalRequests.toLocaleString()}
          description="This month"
          icon={<Zap className="size-5" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Total Tokens"
          value={`${(stats.totalTokens / 1000000).toFixed(1)}M`}
          description="Processed"
          icon={<TrendingUp className="size-5" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="AI Cost"
          value={`$${stats.totalCost.toFixed(2)}`}
          description="Monthly spend"
          icon={<DollarSign className="size-5" />}
          trend={{ value: 3, isPositive: false }}
        />
        <StatsCard
          title="Money Saved"
          value={`$${stats.moneySaved.toFixed(2)}`}
          description="vs. baseline"
          icon={<PieChart className="size-5" />}
          trend={{ value: 24, isPositive: true }}
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Cache Hit Rate"
          value={`${stats.cacheHitRate.toFixed(1)}%`}
          description="Response cache efficiency"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Average Latency"
          value={`${stats.averageLatency}ms`}
          description="Response time"
          trend={{ value: 2, isPositive: false }}
        />
        <StatsCard
          title="Carbon Footprint"
          value={`${stats.carbonFootprint}kg`}
          description="CO₂ equivalent"
          icon={<Leaf className="size-5" />}
          trend={{ value: 8, isPositive: false }}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <DailyRequestsChart data={mockMonthlyData} />
        <MonthlyCostChart data={mockMonthlyData} />
        <TokenUsageChart data={tokenData} />
        <ModelDistributionChart data={mockModelDistribution} />
      </div>

      {/* Cost Comparison */}
      <div>
        <CostComparisonChart data={costComparisonData} />
      </div>

      {/* Active Models */}
      <div className="rounded-lg border border-border/40 bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold">Active Models</h3>
        <div className="flex flex-wrap gap-2">
          {mockDashboardStats.activeModels.map((model) => (
            <div
              key={model}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-3 py-1.5 text-sm font-medium border border-blue-200 dark:border-blue-800/30"
            >
              <Gauge className="size-3" />
              {model}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
