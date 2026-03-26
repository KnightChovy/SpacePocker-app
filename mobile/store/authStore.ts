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
  updateUser: (user: User) => Promise<void>;
  clearError: () => void;
};

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
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
      console.log(
        '[Auth] loadFromStorage — token:',
        token ? 'found' : 'none',
        '| user:',
        userRaw ? 'found' : 'none'
      );
      if (token && userRaw) {
        set({
          accessToken: token,
          user: JSON.parse(userRaw),
          isLoggedIn: true,
        });
      }
    } catch (e) {
      console.error('[Auth] loadFromStorage error:', e);
      set({ isLoggedIn: false });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async ({ email, password }: LoginRequest) => {
    try {
      set({ isLoading: true, error: null });
      console.log('[Auth] login attempt:', email);
      const res = await authService.login({ email, password });
      console.log('[Auth] login raw response:', JSON.stringify(res, null, 2));
      const {
        tokens: { accessToken, refreshToken },
        user,
      } = res.metadata;

      await SecureStore.setItemAsync('access_token', accessToken);
      await SecureStore.setItemAsync('refresh_token', refreshToken);
      await SecureStore.setItemAsync('user', JSON.stringify(user));

      set({ user, accessToken, isLoggedIn: true });
      console.log('[Auth] login success — user:', user);
    } catch (e: any) {
      console.error('[Auth] login error:', {
        message: e.message,
        responseStatus: e.response?.status,
        responseData: e.response?.data,
        isAxiosError: e.isAxiosError,
      });
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
      console.log('[Auth] signup attempt:', data.email);
      const res = await authService.signup(data);
      console.log('[Auth] signup raw response:', JSON.stringify(res, null, 2));
      const {
        tokens: { accessToken, refreshToken },
        user,
      } = res.metadata;

      await SecureStore.setItemAsync('access_token', accessToken);
      await SecureStore.setItemAsync('refresh_token', refreshToken);
      await SecureStore.setItemAsync('user', JSON.stringify(user));

      set({ user, accessToken, isLoggedIn: true });
      console.log('[Auth] signup success — user:', user);
    } catch (e: any) {
      console.error('[Auth] signup error:', {
        message: e.message,
        responseStatus: e.response?.status,
        responseData: e.response?.data,
        isAxiosError: e.isAxiosError,
      });
      const message = e.response?.data?.message ?? 'Registration failed';
      set({ error: message });
      throw new Error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      const { user, accessToken } = get();
      const refreshToken = await SecureStore.getItemAsync('refresh_token');
      console.log(
        '[Auth] logout attempt — userId:',
        user?.id,
        '| hasRefreshToken:',
        !!refreshToken,
        '| hasAccessToken:',
        !!accessToken
      );
      await authService.logout(
        user?.id ?? undefined,
        refreshToken ?? undefined
      );
      console.log('[Auth] logout server call success');
    } catch (e: any) {
      console.warn(
        '[Auth] logout server error (local state will still be cleared):',
        {
          message: e.message,
          status: e.response?.status,
          data: e.response?.data,
          isNetworkError: !e.response,
        }
      );
    } finally {
      await SecureStore.deleteItemAsync('access_token');
      await SecureStore.deleteItemAsync('refresh_token');
      await SecureStore.deleteItemAsync('user');
      set({ user: null, accessToken: null, isLoggedIn: false, error: null });
    }
  },

  updateUser: async (user: User) => {
    await SecureStore.setItemAsync('user', JSON.stringify(user));
    set({ user });
  },

  clearError: () => set({ error: null }),
}));
