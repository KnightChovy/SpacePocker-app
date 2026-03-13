import { authAPI } from '@/apis/auth.api';
import { useAuthStore } from '@/stores/auth.store';
import { useMutation } from '@tanstack/react-query';

export const useRefreshToken = () => {
  const {
    setAccessToken,
    setRefreshToken,
    setUser,
    refreshToken: refresh,
    user,
  } = useAuthStore();
  return useMutation({
    mutationFn: async () => {
      const response = await authAPI.refreshToken({
        refreshToken: refresh!,
        userId: user!.id,
        email: user!.email,
      });
      setAccessToken(response.tokens.accessToken);
      setRefreshToken(response.tokens.refreshToken);
      setUser(response.user);
      return response.tokens.accessToken;
    },
    onError: error => {
      console.error('Refresh token error:', error);
    },
  });
};
