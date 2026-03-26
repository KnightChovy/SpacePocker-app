import { authAPI } from '@/apis/auth/auth.api';
import { useAuthStore } from '@/stores/auth.store';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'react-toastify';

export const useSignup = () => {
  const { setAccessToken, setRefreshToken, setUser } = useAuthStore();
  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      name: string;
      phone?: string;
    }) => {
      const response = await authAPI.signup(data);
      setAccessToken(response.tokens.accessToken);
      setRefreshToken(response.tokens.refreshToken);
      setUser(response.user);
      return true;
    },
    onSuccess: () => {
      toast.success('Signup successful!');
    },
    onError: error => {
      console.error('Signup error:', error);
      const message = isAxiosError(error)
        ? (error.response?.data?.message ?? 'Signup failed. Please try again.')
        : 'Signup failed. Please try again.';
      toast.error(message);
    },
  });
};
