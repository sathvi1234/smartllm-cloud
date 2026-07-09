'use client';

import { generateMockAnalyticsData, mockMonthlyData, mockModelDistribution } from '@/lib/mock-data';
import {
  DailyRequestsChart,
  MonthlyCostChart,
  ModelDistributionChart,
  TokenUsageChart,
} from '@/components/dashboard/Charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, Filter } from 'lucide-react';

const analyticsData = generateMockAnalyticsData();
const tokenData = mockMonthlyData.map((item) => ({
  month: item.month,
  tokens: item.tokens,
}));

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="mt-2 text-muted-foreground">Detailed insights into your AI usage</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="size-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="size-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Time Period Tabs */}
      <Tabs defaultValue="30d" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="7d">7 Days</TabsTrigger>
          <TabsTrigger value="30d">30 Days</TabsTrigger>
          <TabsTrigger value="90d">90 Days</TabsTrigger>
          <TabsTrigger value="all">All Time</TabsTrigger>
        </TabsList>

        <TabsContent value="30d" className="space-y-6">
          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <DailyRequestsChart data={mockMonthlyData} height={300} />
            <MonthlyCostChart data={mockMonthlyData} height={300} />
            <TokenUsageChart data={tokenData} height={300} />
            <ModelDistributionChart data={mockModelDistribution} height={300} />
          </div>

          {/* Detailed Metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg Requests/Day
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">956</p>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Cache Hit Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">28.4%</p>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg Latency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">542ms</p>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Top Model
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">GPT-4o</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="90d" className="text-center text-muted-foreground py-8">
          <p>90-day view coming soon</p>
        </TabsContent>

        <TabsContent value="all" className="text-center text-muted-foreground py-8">
          <p>All-time view coming soon</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
