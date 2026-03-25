import axiosInstance from '@/lib/axios';
import type { ApiResponse } from '@/apis/api.types';

import type {
  GetProfileResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  SignupRequest,
  SignupResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from '@/types/auth/auth.api.types';

export type {
  AuthError,
  AuthSuccessResponse,
  AuthTokens,
  GetProfileRequest,
  GetProfileResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  SignupRequest,
  SignupResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  UpdateUserProfilePayload,
  UserProfileResponse,
} from '@/types/auth/auth.api.types';

const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosInstance.post<ApiResponse<LoginResponse>>(
    '/auth/login',
    payload
  );
  return response.data.metadata;
};

const signup = async (payload: SignupRequest): Promise<SignupResponse> => {
  const response = await axiosInstance.post<ApiResponse<SignupResponse>>(
    '/auth/signup',
    payload
  );
  return response.data.metadata;
};

const logout = async (userId: string): Promise<LogoutResponse> => {
  const response = await axiosInstance.post<ApiResponse<LogoutResponse>>(
    '/auth/logout',
    { userId }
  );
  return response.data.metadata;
};

const refreshToken = async (
  payload: RefreshTokenRequest
): Promise<RefreshTokenResponse> => {
  const response = await axiosInstance.post<ApiResponse<RefreshTokenResponse>>(
    '/auth/refresh-token',
    payload
  );
  return response.data.metadata;
};

const getProfile = async (): Promise<GetProfileResponse> => {
  const response =
    await axiosInstance.get<ApiResponse<GetProfileResponse>>('/users/profile');
  return response.data.metadata;
};

const updateProfile = async (
  payload: UpdateProfileRequest
): Promise<UpdateProfileResponse> => {
  const response = await axiosInstance.patch<
    ApiResponse<UpdateProfileResponse>
  >('/users/profile', payload);
  return response.data.metadata;
};

export const authAPI = {
  login,
  signup,
  logout,
  refreshToken,
  getProfile,
  updateProfile,
};
