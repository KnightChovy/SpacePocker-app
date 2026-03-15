import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { router } from 'expo-router';
const baseApi = process.env.EXPO_PUBLIC_API_URL;
const axiosClient: AxiosInstance = axios.create({
  baseURL: baseApi,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');
        const res = await axios.post(`${baseApi}/auth/refresh`, {
          refreshToken,
        });
        const { accessToken } = res.data;
        await AsyncStorage.setItem('access_token', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosClient(originalRequest);
      } catch (error) {
        console.log(error);
        await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
        router.replace('/(auth)/login');
      }
    }
    return Promise.reject(error);
  }
);
export default axiosClient;
