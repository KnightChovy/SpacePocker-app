import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  userId: string | null;
  setAccessToken: (token: string) => void;
  setUserId: (id: string) => void;
  clearAccessToken: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      accessToken: null,
      userId: null,

      setAccessToken: token => set({ accessToken: token }),

      setUserId: id => set({ userId: id }),

      clearAccessToken: () => set({ accessToken: null, userId: null }),
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        accessToken: state.accessToken,
        userId: state.userId,
      }),
    }
  )
);
