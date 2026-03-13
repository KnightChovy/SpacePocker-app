import { Manager, User } from "@prisma/client";

export interface IManagerRepository {
  findByUserIdentity(userId: string, email: string): Promise<Manager | null>;
  createFromUser(user: User): Promise<Manager>;
}
