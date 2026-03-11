import axios from 'axios';
import { useAuthStore } from '@/stores/auth.store';

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

export default axiosInstance;
