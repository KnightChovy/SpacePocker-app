import type {
  GetUsersResponse,
  UsersQueryParams,
} from '@/types/admin/users-api';

export type ListUsersRequest = { params?: UsersQueryParams };
export type ListUsersResponse = GetUsersResponse;

export type PromoteUserToManagerRequest = { userId: string };
export type PromoteUserToManagerResponse = void;
