import axiosInstance from '@/lib/axios';

export interface AuthError {
  message: string;
  status?: number;
}

const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const response = await axiosInstance.post('/auth/login', { email, password });
  return response.data.metadata;
};

const signup = async ({
  email,
  password,
  name,
  phone,
}: {
  email: string;
  password: string;
  name: string;
  phone?: string;
}) => {
  const response = await axiosInstance.post('/auth/signup', {
    email,
    password,
    name,
    phone,
  });
  return response.data.metadata;
};

const logout = async (userId: string) => {
  const response = await axiosInstance.post('/auth/logout', { userId });
  return response.data.metadata;
};

const refreshToken = async ({
  refreshToken,
  userId,
  email,
}: {
  refreshToken: string;
  userId: string;
  email: string;
}) => {
  const response = await axiosInstance.post('/auth/refresh-token', {
    refreshToken,
    userId,
    email,
  });
  return response.data.metadata;
};

export const authAPI = { login, signup, logout, refreshToken };
