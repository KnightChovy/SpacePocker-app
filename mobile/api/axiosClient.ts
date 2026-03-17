import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

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
    const { useAuthStore } = require('@/store/authStore');
    const { accessToken, user } = useAuthStore.getState();

    if (accessToken) {
      config.headers['authorization'] = `Bearer ${accessToken}`;
      if (user?.id) {
        config.headers['x-client-id'] = user.id;
      }
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
        const refreshToken = await SecureStore.getItemAsync('refresh_token');
        const userRaw = await SecureStore.getItemAsync('user');
        const user = userRaw ? JSON.parse(userRaw) : null;

        if (!refreshToken) throw new Error('No refresh token');

        const res = await axios.post(`${baseApi}/auth/refresh-token`, null, {
          headers: {
            'x-refresh-token': refreshToken,
            'x-client-id': user?.id,
          },
        });

        const { accessToken, refreshToken: newRefreshToken } =
          res.data.metadata.tokens;

        await SecureStore.setItemAsync('access_token', accessToken);
        if (newRefreshToken) {
          await SecureStore.setItemAsync('refresh_token', newRefreshToken);
        }

        const { useAuthStore } = require('@/store/authStore');
        useAuthStore.setState({ accessToken });

        originalRequest.headers['authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['x-client-id'] = user?.id;

        return axiosClient(originalRequest);
      } catch (err) {
        console.log(err);

        await SecureStore.deleteItemAsync('access_token');
        await SecureStore.deleteItemAsync('refresh_token');
        await SecureStore.deleteItemAsync('user');

        const { useAuthStore } = require('@/store/authStore');
        useAuthStore.setState({
          user: null,
          accessToken: null,
          isLoggedIn: false,
        });

        router.replace('/(auth)/login');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
