import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Zap,
  BarChart3,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'SmartLLM Cloud - AI Cost & Token Optimization',
  description: 'Optimize every AI request for cost, speed, quality, and privacy. Reduce your LLM spending by up to 70%.',
};

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-20 lg:py-24">
        {/* Background Gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent" />
        <div className="absolute -right-40 -top-40 -z-10 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="container max-w-7xl space-y-8 px-4 text-center md:space-y-12">
          <div className="space-y-4">
            <div className="inline-block rounded-full bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-600">
              <span className="flex items-center gap-2">
                <Sparkles className="size-4" />
                Introducing SmartLLM Cloud
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Optimize Every AI Request
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
              Reduce your LLM spending by up to 70% while improving speed and quality. SmartLLM Cloud is an
              intelligent middleware that analyzes, optimizes, and routes your prompts intelligently.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
            <Button size="lg" asChild className="gap-2">
              <Link href="/register">
                Get Started Free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border/40 py-12 md:py-20">
        <div className="container max-w-7xl space-y-12 px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Powerful Features</h2>
            <p className="mt-4 text-muted-foreground">Everything you need to optimize your AI spending</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="group rounded-lg border border-border/40 bg-background/50 p-6 transition-colors hover:bg-accent/50">
              <div className="mb-4 inline-flex rounded-lg bg-blue-500/10 p-3">
                <Zap className="size-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Smart Optimization</h3>
              <p className="text-sm text-muted-foreground">
                Our AI analyzes and optimizes your prompts automatically, reducing tokens by up to 40% without
                sacrificing quality.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-lg border border-border/40 bg-background/50 p-6 transition-colors hover:bg-accent/50">
              <div className="mb-4 inline-flex rounded-lg bg-purple-500/10 p-3">
                <BarChart3 className="size-6 text-purple-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Real-time Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Track spending, latency, cache hits, and model performance with beautiful, interactive dashboards.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-lg border border-border/40 bg-background/50 p-6 transition-colors hover:bg-accent/50">
              <div className="mb-4 inline-flex rounded-lg bg-pink-500/10 p-3">
                <Lock className="size-6 text-pink-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Intelligent Routing</h3>
              <p className="text-sm text-muted-foreground">
                Automatically select the best model for each request based on cost, speed, quality, and your
                requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="border-t border-border/40 py-12 md:py-20">
        <div className="container max-w-7xl space-y-12 px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Why Choose SmartLLM?</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Save up to 70%', desc: 'on LLM costs' },
              { label: '40% Token Reduction', desc: 'through optimization' },
              { label: '5+ AI Providers', desc: 'on one platform' },
              { label: 'Real-time Cache', desc: 'instant speed boost' },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-3 rounded-lg bg-muted/50 p-4">
                <CheckCircle2 className="size-5 shrink-0 text-green-500" />
                <div>
                  <p className="font-semibold">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/40 py-12 md:py-20">
        <div className="container max-w-4xl space-y-8 px-4 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Start Optimizing Today</h2>
          <p className="text-lg text-muted-foreground">
            Join hundreds of teams reducing their AI spending while improving performance.
          </p>
          <Button size="lg" asChild className="gap-2">
            <Link href="/register">
              Get Started for Free
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
