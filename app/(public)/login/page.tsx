import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In - SmartLLM Cloud',
  description: 'Sign in to your SmartLLM Cloud account',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Gradient Background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />

        <Card className="border border-border/40">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your SmartLLM Cloud account</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        {/* Features callout */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center text-xs text-muted-foreground md:mt-12">
          <div>
            <div className="mb-2 text-lg">⚡</div>
            <p>Fast & Secure</p>
          </div>
          <div>
            <div className="mb-2 text-lg">💰</div>
            <p>Save Money</p>
          </div>
          <div>
            <div className="mb-2 text-lg">📊</div>
            <p>Smart Analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
}
