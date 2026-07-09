'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/lib/store/theme-store';
import { useAuthStore } from '@/lib/store/auth-store';
import { Toaster } from '@/components/ui/toaster';

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const initTheme = useThemeStore((state) => state.initTheme);
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    // Initialize theme and auth from localStorage on mount
    initTheme();
    initAuth();
  }, [initTheme, initAuth]);

  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
