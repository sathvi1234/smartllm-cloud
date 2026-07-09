import { useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/auth-store';

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, error, initAuth, login, logout, register } =
    useAuthStore();

  // Initialize auth on mount (restore from localStorage)
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      await login(email, password);
      // Save to localStorage in the store's persist middleware
    },
    [login]
  );

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const handleRegister = useCallback(
    async (email: string, password: string, name: string) => {
      await register(email, password, name);
    },
    [register]
  );

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
  };
};
