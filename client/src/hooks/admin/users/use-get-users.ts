import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import type { GetUsersResponse, UsersQueryParams } from '@/types/users-api';

export const useGetUsers = (params?: UsersQueryParams) => {
  return useQuery({
    queryKey: ['admin', 'users', 'list', params],
    queryFn: async () => {
      const response = await axiosInstance.get<{ metadata: GetUsersResponse }>(
        '/users',
        { params }
      );
      return response.data.metadata;
    },
  });
};
