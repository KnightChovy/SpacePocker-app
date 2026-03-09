import axiosInstance from '@/lib/axios';

export const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post('/login', {
      email,
      password,
    });
    return response.data.metadata;
  } catch (error) {
    console.error('Login error:', error);
  }
};

export const signup = async (
  email: string,
  password: string,
  name: string,
  phone: string
) => {
  try {
    const response = await axiosInstance.post('/signup', {
      email,
      password,
      name,
      phone,
    });
    return response.data.metadata;
  } catch (error) {
    console.error('Registration error:', error);
  }
};

export const logout = async (userId: string) => {
  try {
    const response = await axiosInstance.post('/logout', { userId });
    return response.data.metadata;
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const refreshToken = async (
  refreshToken: string,
  userId: string,
  email: string
) => {
  try {
    const response = await axiosInstance.post('/refresh-token', {
      refreshToken,
      userId,
      email,
    });
    return response.data.metadata;
  } catch (error) {
    console.error('Refresh token error:', error);
  }
};
