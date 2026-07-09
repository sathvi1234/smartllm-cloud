'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MODELS } from '@/lib/constants';
import { mockModelComparison } from '@/lib/mock-data';
import { Zap, TrendingUp, Gauge } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';

export default function ModelRouterPage() {
  const [prompt, setPrompt] = useState(
    'Analyze customer sentiment from recent product reviews and provide insights.'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { addNotification } = useUIStore();

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsAnalyzing(false);
    addNotification({
      id: `notification_${Date.now()}`,
      type: 'success',
      message: 'Analysis complete',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Model Router</h1>
        <p className="mt-2 text-muted-foreground">
          Intelligently select the best AI model for your specific use case
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Input */}
        <Card className="glass lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Your Prompt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt..."
              className="min-h-24"
            />
            <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full">
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </Button>
          </CardContent>
        </Card>

        {/* Recommendation */}
        <Card className="glass lg:col-span-2 bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-blue-200/50 dark:border-blue-800/30">
          <CardHeader>
            <CardTitle className="text-lg">Recommended Model</CardTitle>
            <CardDescription>Best choice for your prompt</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border-2 border-blue-500/50 bg-background p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xl font-bold">GPT-4o</h3>
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-600">Recommended</Badge>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">OpenAI's fast and efficient model</p>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className="rounded bg-muted/50 p-2 text-center">
                  <p className="text-xs text-muted-foreground">Cost</p>
                  <p className="font-bold">$0.015</p>
                </div>
                <div className="rounded bg-muted/50 p-2 text-center">
                  <p className="text-xs text-muted-foreground">Latency</p>
                  <p className="font-bold">600ms</p>
                </div>
                <div className="rounded bg-muted/50 p-2 text-center">
                  <p className="text-xs text-muted-foreground">Quality</p>
                  <p className="font-bold">92/100</p>
                </div>
                <div className="rounded bg-muted/50 p-2 text-center">
                  <p className="text-xs text-muted-foreground">Speed</p>
                  <p className="font-bold">200 t/s</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <p className="text-sm font-semibold mb-2">Why this model?</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✓ Complexity analysis: Medium-high</li>
                <li>✓ Optimal cost-quality balance</li>
                <li>✓ Fast response time</li>
                <li>✓ Suitable for sentiment analysis</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Model Comparison Table */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg">Model Comparison</CardTitle>
          <CardDescription>See how all models stack up</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model</TableHead>
                  <TableHead className="text-right">Cost/1K Input</TableHead>
                  <TableHead className="text-right">Cost/1K Output</TableHead>
                  <TableHead className="text-right">Latency</TableHead>
                  <TableHead className="text-right">Quality</TableHead>
                  <TableHead className="text-right">Speed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockModelComparison.map((model) => (
                  <TableRow
                    key={model.model}
                    className={
                      model.model === 'GPT-4o'
                        ? 'bg-blue-500/5 border-l-2 border-blue-500'
                        : ''
                    }
                  >
                    <TableCell className="font-semibold">{model.model}</TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      ${model.costPer1kInput.toFixed(5)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      ${model.costPer1kOutput.toFixed(5)}
                    </TableCell>
                    <TableCell className="text-right">{model.latency}ms</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{model.quality}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{model.speed} t/s</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
