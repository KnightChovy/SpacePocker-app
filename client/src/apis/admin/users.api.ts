import axiosInstance from '@/lib/axios';
import type { ApiResponse } from '@/apis/api.types';
import type { UsersQueryParams } from '@/types/admin/users-api';

import type {
  ListUsersResponse,
  PromoteUserToManagerResponse,
} from '@/types/admin/users.api.types';

export type {
  ListUsersRequest,
  ListUsersResponse,
  PromoteUserToManagerRequest,
  PromoteUserToManagerResponse,
} from '@/types/admin/users.api.types';

const list = async (params?: UsersQueryParams): Promise<ListUsersResponse> => {
  const response = await axiosInstance.get<ApiResponse<ListUsersResponse>>(
    '/users',
    { params }
  );
  return response.data.metadata;
};

const promoteToManager = async (userId: string): Promise<string> => {
  await axiosInstance.patch<PromoteUserToManagerResponse>(
    `/admin/users/promote-manager/${userId}`
  );
  return userId;
};

export const adminUsersApi = {
  list,
  promoteToManager,
};
