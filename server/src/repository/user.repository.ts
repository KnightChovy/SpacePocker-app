import { prisma } from "../lib/prisma";
import { IUserRepository } from "../interface/user.repository.interface";

export class UserRepository implements IUserRepository {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  createUser(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        phoneNumber: data.phone,
        role: "USER",
      },
    });
  }
}
