import axiosClient from '@/api/axiosClient';
import { LoginRequest } from '@/types/auth.type';
import { User } from '@/types/user.type';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
type AuthState = {
  user: User | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
};

type AuthActions = {
  login: ({ email, password }: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
  clearError: () => void;
};

export const useAuthStore = create<AuthState & AuthActions>(set => ({
  // Initial state
  user: null,
  accessToken: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,

  loadFromStorage: async () => {
    try {
      set({ isLoading: true });
      const token = await SecureStore.getItemAsync('access_token');
      const userRaw = await SecureStore.getItemAsync('user');

      if (token && userRaw) {
        set({
          accessToken: token,
          user: JSON.parse(userRaw),
          isLoggedIn: true,
        });
      }
    } catch {
      set({ isLoggedIn: false });
    } finally {
      set({ isLoading: false });
    }
  },
  login: async ({ email, password }: LoginRequest) => {
    try {
      set({ isLoading: true, error: null });

      const res = await axiosClient.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user } = res.data;

      await SecureStore.setItemAsync('access_token', accessToken);
      await SecureStore.setItemAsync('refresh_token', refreshToken);
      await SecureStore.setItemAsync('user', JSON.stringify(user));

      set({ user, accessToken, isLoggedIn: true });
    } catch (e: any) {
      const message = e.response?.data?.message ?? 'Đăng nhập thất bại';
      set({ error: message });
      throw new Error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await axiosClient.post('/auth/logout');
    } finally {
      await SecureStore.deleteItemAsync('access_token');
      await SecureStore.deleteItemAsync('refresh_token');
      await SecureStore.deleteItemAsync('user');
      set({ user: null, accessToken: null, isLoggedIn: false, error: null });
    }
  },

  clearError: () => set({ error: null }),
}));
