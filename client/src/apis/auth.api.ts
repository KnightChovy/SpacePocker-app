import axiosInstance from '@/lib/axios';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseData {
  user: { id: string; name: string; email: string };
  tokens: { accessToken: string; refreshToken: string };
}

export interface AuthError {
  message: string;
  error?: string;
}

export const authAPI = {
  login: async (data: LoginRequest): Promise<LoginResponseData> => {
    const res = await axiosInstance.post<{
      message: string;
      metadata: LoginResponseData;
    }>('/login', data);
    return res.data.metadata;
  },
};
