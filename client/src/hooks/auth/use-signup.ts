import { signup } from '@/apis/auth.api';
import { useAuthStore } from '@/stores/auth.store';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useSignup = () => {
  const { setAccessToken, setRefreshToken, setUser } = useAuthStore();
  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      name: string;
      phone: string;
    }) => {
      const response = await signup(
        data.email,
        data.password,
        data.name,
        data.phone
      );
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
      toast.error('Signup failed. Please try again.');
    },
  });
};
