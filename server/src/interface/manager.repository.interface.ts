import { Manager, User } from '@prisma/client';

export interface IManagerRepository {
  findById(id: string): Promise<Manager | null>;
  findByUserIdentity(userId: string, email: string): Promise<Manager | null>;
  createFromUser(user: User): Promise<Manager>;
}
