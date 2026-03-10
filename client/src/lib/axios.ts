import axios from 'axios';
import { useAuthStore } from '@/stores/auth.store';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/v1/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(config => {
  const { accessToken, userId } = useAuthStore.getState();
  if (userId) config.headers['x-client-id'] = userId;
  if (accessToken) config.headers['authorization'] = accessToken;
  return config;
});

export default axiosInstance;
