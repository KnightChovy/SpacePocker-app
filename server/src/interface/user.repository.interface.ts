export interface IUserRepository {
  findByEmail(email: string): Promise<any | null>;
  findById(id: string): Promise<any | null>;
  updateRole(id: string, role: "USER" | "MANAGER" | "ADMIN"): Promise<any>;
  createUser(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<any>;
}
