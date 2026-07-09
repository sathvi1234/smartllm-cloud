'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/lib/store/theme-store';
import { useAuthStore } from '@/lib/store/auth-store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useThemeStore as getTheme } from '@/lib/store/theme-store';
import { Moon, Sun } from 'lucide-react';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const isDark = getTheme((state) => state.isDark);
  const toggleTheme = getTheme((state) => state.toggleTheme);
  const initTheme = getTheme((state) => state.initTheme);
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <span className="text-xs font-bold text-white">SLC</span>
            </div>
            <span className="text-lg font-bold">SmartLLM</span>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="inline-flex items-center justify-center rounded-md p-2 hover:bg-accent"
            >
              {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/50 py-8">
        <div className="container max-w-7xl text-center text-sm text-muted-foreground">
          <p>&copy; 2024 SmartLLM Cloud. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
