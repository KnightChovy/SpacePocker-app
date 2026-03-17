import { ApiResponse } from './api.type';
import { User } from './user.type';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
export interface LoginMetadata {
  user: User;
  tokens: AuthTokens;
}

export interface RefreshTokenRequest {
  refreshToken: string;
  userId: string;
  email: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
}
export interface SignUpMetadata {
  user: User;
  tokens: AuthTokens;
}

export type SignUpResponse = ApiResponse<SignUpMetadata>;

export type LoginResponse = ApiResponse<LoginMetadata>;
