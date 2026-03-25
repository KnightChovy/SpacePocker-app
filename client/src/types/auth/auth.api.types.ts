import type { USER_DATA } from '@/types/auth/auth-type';

export interface AuthError {
  message: string;
  status?: number;
}

export interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  role: 'USER' | 'MANAGER' | 'ADMIN';
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserProfilePayload {
  name?: string;
  phoneNumber?: string | null;
}

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthSuccessResponse = {
  user: USER_DATA;
  tokens: AuthTokens;
};

export type LoginRequest = { email: string; password: string };
export type LoginResponse = AuthSuccessResponse;

export type SignupRequest = {
  email: string;
  password: string;
  name: string;
  phone?: string;
};
export type SignupResponse = AuthSuccessResponse;

export type LogoutRequest = { userId: string };
export type LogoutResponse = unknown;

export type RefreshTokenRequest = {
  refreshToken: string;
  userId: string;
  email: string;
};
export type RefreshTokenResponse = AuthSuccessResponse;

export type GetProfileRequest = void;
export type GetProfileResponse = UserProfileResponse;

export type UpdateProfileRequest = UpdateUserProfilePayload;
export type UpdateProfileResponse = UserProfileResponse;
