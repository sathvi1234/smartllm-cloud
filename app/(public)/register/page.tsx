import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Sign Up - SmartLLM Cloud',
  description: 'Create a new SmartLLM Cloud account',
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Gradient Background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />

        <Card className="border border-border/40">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Get Started</CardTitle>
            <CardDescription>Create your SmartLLM Cloud account in seconds</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>

        {/* Benefits callout */}
        <div className="mt-8 space-y-3 text-sm">
          <div className="flex gap-3">
            <div className="text-2xl">🔒</div>
            <div>
              <p className="font-semibold text-foreground">Secure & Private</p>
              <p className="text-xs text-muted-foreground">Your data is encrypted and never shared</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-2xl">⚙️</div>
            <div>
              <p className="font-semibold text-foreground">Easy Setup</p>
              <p className="text-xs text-muted-foreground">Get started in minutes, no credit card required</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-2xl">🚀</div>
            <div>
              <p className="font-semibold text-foreground">Instant Results</p>
              <p className="text-xs text-muted-foreground">Start optimizing your AI requests right away</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
