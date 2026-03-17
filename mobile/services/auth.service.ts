import axiosClient from '@/api/axiosClient';
import { ApiResponse } from '@/types/api.type';
import {
  AuthTokens,
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  SignUpResponse,
} from '@/types/auth.type';

const authService = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const res = await axiosClient.post<LoginResponse>('/login', payload);
    return res.data;
  },
  signup: async (payload: SignUpRequest): Promise<SignUpResponse> => {
    const res = await axiosClient.post<SignUpResponse>('/signup', payload);
    return res.data;
  },
  logout: async (userId?: string, refreshToken?: string): Promise<void> => {
    await axiosClient.post('/logout', userId ? { userId } : null, {
      headers: refreshToken ? { 'x-refresh-token': refreshToken } : undefined,
    });
  },

  refreshToken: async (
    refreshToken: string
  ): Promise<ApiResponse<AuthTokens>> => {
    const res =
      await axiosClient.post<ApiResponse<AuthTokens>>('/refresh-token');
    return res.data;
  },
};
export default authService;
