'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Copy, ArrowRight } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';

export default function PromptOptimizerPage() {
  const [originalPrompt, setOriginalPrompt] = useState(
    'Write a comprehensive blog post about artificial intelligence and its impact on modern society, including examples, statistics, and future predictions.'
  );
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { addNotification } = useUIStore();

  const optimizedPrompt =
    'Explain AI impact on society with examples, stats, and forecasts.';
  const shortPrompt = 'AI impact on modern society.';

  const handleOptimize = async () => {
    setIsOptimizing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsOptimizing(false);
    addNotification({
      id: `notification_${Date.now()}`,
      type: 'success',
      message: 'Prompt optimized successfully',
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    addNotification({
      id: `notification_${Date.now()}`,
      type: 'success',
      message: 'Copied to clipboard',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Prompt Optimizer</h1>
        <p className="mt-2 text-muted-foreground">
          Get AI-powered suggestions to optimize your prompts for better results and lower costs
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Original Prompt */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg">Original Prompt</CardTitle>
            <CardDescription>Your input prompt</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={originalPrompt}
              onChange={(e) => setOriginalPrompt(e.target.value)}
              placeholder="Paste your prompt here..."
              className="min-h-32"
            />
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Tokens: ~{Math.ceil(originalPrompt.split(' ').length * 1.3)}</span>
                <span>Est. Cost: $0.0145</span>
              </div>
              <Button onClick={handleOptimize} disabled={isOptimizing} className="w-full gap-2">
                <Sparkles className="size-4" />
                {isOptimizing ? 'Analyzing...' : 'Optimize'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Analysis */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg">Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label className="text-sm">Quality Score</Label>
                <span className="font-bold">92/100</span>
              </div>
              <Progress value={92} />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Improvements</Label>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✓ Remove redundant phrases</li>
                <li>✓ Simplify vocabulary</li>
                <li>✓ Add context specification</li>
                <li>✓ Clarify expected output format</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optimizations */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg">Optimization Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Original vs Optimized */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold mb-2 block">Standard Optimized</Label>
              <div className="relative flex items-start gap-4">
                <div className="flex-1 rounded-lg bg-muted/50 p-4">
                  <p className="text-sm leading-relaxed">{optimizedPrompt}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopy(optimizedPrompt)}
                  className="gap-2 mt-2"
                >
                  <Copy className="size-4" />
                </Button>
              </div>
              <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                <span>Tokens: ~45 (-65%)</span>
                <span>Cost: $0.0034 (-76%)</span>
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">Ultra-Short</Label>
              <div className="relative flex items-start gap-4">
                <div className="flex-1 rounded-lg bg-muted/50 p-4">
                  <p className="text-sm leading-relaxed">{shortPrompt}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopy(shortPrompt)}
                  className="gap-2 mt-2"
                >
                  <Copy className="size-4" />
                </Button>
              </div>
              <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                <span>Tokens: ~12 (-91%)</span>
                <span>Cost: $0.0009 (-94%)</span>
              </div>
            </div>
          </div>

          {/* Metrics Comparison */}
          <div className="space-y-3 border-t border-border pt-4">
            <h4 className="font-semibold text-sm">Comparison</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground mb-1">Original</p>
                <p className="font-mono text-sm font-bold">100%</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground mb-1">Optimized</p>
                <p className="font-mono text-sm font-bold text-green-600">+18%</p>
                <p className="text-xs text-muted-foreground">quality</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground mb-1">Saved</p>
                <p className="font-mono text-sm font-bold text-emerald-600">76%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
