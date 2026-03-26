import { authAPI } from '@/apis/auth/auth.api';
import { useAuthStore } from '@/stores/auth.store';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'react-toastify';

export const useLogin = () => {
  const { setAccessToken, setRefreshToken, setUser } = useAuthStore();
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await authAPI.login(data);
      setAccessToken(response.tokens.accessToken);
      setRefreshToken(response.tokens.refreshToken);
      setUser(response.user);
      return response.user;
    },
    onSuccess: () => {
      toast.success('Login successful!');
    },
    onError: error => {
      console.error('Login error:', error);
      const message = isAxiosError(error)
        ? (error.response?.data?.message ??
          'Login failed. Please check your credentials.')
        : 'Login failed. Please check your credentials.';
      toast.error(message);
    },
  });
};
