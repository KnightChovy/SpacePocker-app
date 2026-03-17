import axiosInstance from '@/lib/axios';

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

const getProfile = async () => {
  const response = await axiosInstance.get('/users/profile');
  return response.data.metadata as UserProfileResponse;
};

const updateProfile = async (payload: UpdateUserProfilePayload) => {
  const response = await axiosInstance.patch('/users/profile', payload);
  return response.data.metadata as UserProfileResponse;
};

export const authAPI = {
  login,
  signup,
  logout,
  refreshToken,
  getProfile,
  updateProfile,
};
