import { useQuery } from '@tanstack/react-query';
import { authAPI } from '@/apis/auth/auth.api';

export const useGetUserProfile = () => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: authAPI.getProfile,
  });
};
