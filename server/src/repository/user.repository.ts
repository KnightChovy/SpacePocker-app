import { prisma } from "../lib/prisma";
import {
  IUserRepository,
  GetUsersFilter,
  PaginationParams,
} from "../interface/user.repository.interface";
import { Role, Prisma } from "@prisma/client";

export class UserRepository implements IUserRepository {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  findByIdWithPassword(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
      },
    });
  }

  updateRole(id: string, role: Role) {
    return prisma.user.update({
      where: { id },
      data: { role },
    });
  }

  updateProfile(
    id: string,
    data: { name?: string; phoneNumber?: string | null },
  ) {
    return prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        phoneNumber: data.phoneNumber,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  updatePassword(id: string, password: string) {
    return prisma.user.update({
      where: { id },
      data: { password },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
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

  async findMany(
    filter: GetUsersFilter,
    pagination: PaginationParams,
  ): Promise<any[]> {
    const where: Prisma.UserWhereInput = {};

    if (filter.search) {
      where.OR = [
        { name: { contains: filter.search, mode: "insensitive" } },
        { email: { contains: filter.search, mode: "insensitive" } },
      ];
    }

    if (filter.role) {
      where.role = filter.role as Role;
    }

    return prisma.user.findMany({
      where,
      skip: pagination.skip,
      take: pagination.take,
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async count(filter: GetUsersFilter): Promise<number> {
    const where: Prisma.UserWhereInput = {};

    if (filter.search) {
      where.OR = [
        { name: { contains: filter.search, mode: "insensitive" } },
        { email: { contains: filter.search, mode: "insensitive" } },
      ];
    }

    if (filter.role) {
      where.role = filter.role as Role;
    }

    return prisma.user.count({ where });
  }
}
