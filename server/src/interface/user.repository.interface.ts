export interface GetUsersFilter {
  search?: string;
  role?: string;
}

export interface PaginationParams {
  skip: number;
  take: number;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<any | null>;
  findById(id: string): Promise<any | null>;
  updateProfile(
    id: string,
    data: { name?: string; phoneNumber?: string | null },
  ): Promise<any>;
  updateRole(id: string, role: "USER" | "MANAGER" | "ADMIN"): Promise<any>;
  createUser(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<any>;
  findMany(
    filter: GetUsersFilter,
    pagination: PaginationParams,
  ): Promise<any[]>;
  count(filter: GetUsersFilter): Promise<number>;
}
