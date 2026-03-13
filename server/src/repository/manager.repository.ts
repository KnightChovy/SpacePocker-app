import { IManagerRepository } from "../interface/manager.repository.interface";
import { prisma } from "../lib/prisma";
import { User } from "@prisma/client";

export class ManagerRepository implements IManagerRepository {
  findByUserIdentity(userId: string, email: string) {
    return prisma.manager.findFirst({
      where: {
        OR: [{ id: userId }, { email }],
      },
    });
  }

  createFromUser(user: User) {
    return prisma.manager.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: "MANAGER",
      },
    });
  }
}
