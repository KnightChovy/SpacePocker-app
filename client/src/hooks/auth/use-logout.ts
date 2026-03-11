import { authAPI } from '@/apis/auth.api';
import { useAuthStore } from '@/stores/auth.store';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useLogout = () => {
  const { clearAccessToken, clearRefreshToken, clearUser } = useAuthStore();
  return useMutation({
    mutationFn: async ( userId: string ) => {
      const response = await authAPI.logout(userId);
      clearAccessToken();
      clearRefreshToken();
      clearUser();
      return response;
    },
    onSuccess: () => {
      toast.success('Logout successful!');
    },
    onError: error => {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
    },
  });
};
