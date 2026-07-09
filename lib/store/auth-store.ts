import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthState } from '../types';
import { STORAGE_KEYS } from '../constants';

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
  initAuth: () => void;
}

const mockUsers: Record<string, { password: string; user: User }> = {
  'demo@smartllm.ai': {
    password: 'demo123',
    user: {
      id: '1',
      email: 'demo@smartllm.ai',
      name: 'Demo User',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date(),
    },
  },
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user: User | null) => set({ user, isAuthenticated: user !== null }),
      setToken: (token: string | null) => set({ token }),
      setIsLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 800));

          const mockUser = mockUsers[email];
          if (!mockUser || mockUser.password !== password) {
            throw new Error('Invalid email or password');
          }

          const token = `token_${Date.now()}_${Math.random()}`;
          set({
            user: mockUser.user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          if (mockUsers[email]) {
            throw new Error('Email already exists');
          }

          const newUser: User = {
            id: `user_${Date.now()}`,
            email,
            name,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          mockUsers[email] = {
            password,
            user: newUser,
          };

          const token = `token_${Date.now()}_${Math.random()}`;
          set({
            user: newUser,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Registration failed';
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      initAuth: () => {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            set({
              token,
              user,
              isAuthenticated: true,
            });
          } catch (error) {
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
          }
        } else {
          // For demo purposes, automatically log in the demo user
          const demoUser = mockUsers['demo@smartllm.ai'].user;
          const demoToken = `token_${Date.now()}_demo`;
          set({
            user: demoUser,
            token: demoToken,
            isAuthenticated: true,
          });
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, demoToken);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(demoUser));
        }
      },
    }),
    {
      name: STORAGE_KEYS.AUTH_TOKEN,
      getStorage: () => localStorage,
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
