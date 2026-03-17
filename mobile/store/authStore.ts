import authService from '@/services/auth.service';
import { LoginRequest, SignUpRequest } from '@/types/auth.type';
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
  signup: (data: SignUpRequest) => Promise<void>;
  logout: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
  clearError: () => void;
};

export const useAuthStore = create<AuthState & AuthActions>(set => ({
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
      const res = await authService.login({ email, password });
      const {
        tokens: { accessToken, refreshToken },
        user,
      } = res.metadata;

      await SecureStore.setItemAsync('access_token', accessToken);
      await SecureStore.setItemAsync('refresh_token', refreshToken);
      await SecureStore.setItemAsync('user', JSON.stringify(user));

      set({ user, accessToken, isLoggedIn: true });
    } catch (e: any) {
      const message = e.response?.data?.message ?? 'Login failed';
      set({ error: message });
      throw new Error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async (data: SignUpRequest) => {
    try {
      set({ isLoading: true, error: null });
      const res = await authService.signup(data);
      const {
        tokens: { accessToken, refreshToken },
        user,
      } = res.metadata;

      await SecureStore.setItemAsync('access_token', accessToken);
      await SecureStore.setItemAsync('refresh_token', refreshToken);
      await SecureStore.setItemAsync('user', JSON.stringify(user));

      set({ user, accessToken, isLoggedIn: true });
    } catch (e: any) {
      const message = e.response?.data?.message ?? 'Registration failed';
      set({ error: message });
      throw new Error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync('refresh_token');
      await authService.logout(refreshToken ?? undefined);
    } catch (e) {
      console.log('[logout] server error (ignored):', e);
    } finally {
      await SecureStore.deleteItemAsync('access_token');
      await SecureStore.deleteItemAsync('refresh_token');
      await SecureStore.deleteItemAsync('user');
      set({ user: null, accessToken: null, isLoggedIn: false, error: null });
    }
  },

  clearError: () => set({ error: null }),
}));
