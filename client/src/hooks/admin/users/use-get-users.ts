import { useQuery } from '@tanstack/react-query';
import { adminUsersApi } from '@/apis/admin/users.api';
import type { UsersQueryParams } from '@/types/admin/users-api';

export const useGetUsers = (params?: UsersQueryParams) => {
  return useQuery({
    queryKey: ['admin', 'users', 'list', params],
    queryFn: async () => {
      return adminUsersApi.list(params);
    },
  });
};
