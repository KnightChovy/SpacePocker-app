import axios from 'axios';
import { useAuthStore } from '@/stores/auth.store';
import { authAPI } from '@/apis/auth.api';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(config => {
  const { accessToken, user } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `${accessToken}`;
    config.headers['x-client-id'] = user?.id || '';
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    const status = error.response?.status;
    const requestUrl: string = originalRequest?.url || '';
    const isAuthEndpoint =
      requestUrl.includes('/login') ||
      requestUrl.includes('/signup') ||
      requestUrl.includes('/refresh-token') ||
      requestUrl.includes('/logout');

    if (
      (status === 401 || status === 403) &&
      !isAuthEndpoint &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = token as string;
            return axiosInstance(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const {
        refreshToken,
        user,
        setAccessToken,
        setRefreshToken,
        setUser,
        clearAccessToken,
        clearRefreshToken,
        clearUser,
      } = useAuthStore.getState();

      if (!refreshToken || !user) {
        clearAccessToken();
        clearRefreshToken();
        clearUser();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await authAPI.refreshToken({
          refreshToken,
          userId: user.id,
          email: user.email,
        });

        const newAccessToken = response.tokens.accessToken;
        setAccessToken(newAccessToken);
        setRefreshToken(response.tokens.refreshToken);
        setUser(response.user);

        originalRequest.headers.Authorization = newAccessToken;

        processQueue(null, newAccessToken);
        isRefreshing = false;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        clearAccessToken();
        clearRefreshToken();
        clearUser();
        window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
