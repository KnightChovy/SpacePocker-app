export type ApiUserRole = 'USER' | 'MANAGER' | 'ADMIN';

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  role: ApiUserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UsersPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetUsersResponse {
  users: ApiUser[];
  pagination: UsersPagination;
}

export interface UsersQueryParams {
  search?: string;
  role?: ApiUserRole;
  page?: number;
  limit?: number;
}
