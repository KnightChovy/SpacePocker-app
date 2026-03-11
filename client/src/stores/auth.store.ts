import type { USER_DATA } from '@/types/auth-type';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: USER_DATA | null;
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  setUser: (userData: USER_DATA) => void;
  clearUser: () => void;
  clearRefreshToken: () => void;
  clearAccessToken: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      accessToken: null,
      refreshToken: null,
      user: null,

      setUser: (userData: USER_DATA) => set({ user: userData }),
      clearUser: () => set({ user: null }),

      setAccessToken: token => set({ accessToken: token }),
      setRefreshToken: token => set({ refreshToken: token }),

      clearAccessToken: () => set({ accessToken: null }),
      clearRefreshToken: () => set({ refreshToken: null }),
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);
