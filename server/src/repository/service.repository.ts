import { prisma } from "../lib/prisma";
import {
  IServiceRepository,
  CreateServiceInput,
  UpdateServiceInput,
} from "../interface/service.repository.interface";
import { Service } from "@prisma/client";

export class ServiceRepository implements IServiceRepository {
  async create(data: CreateServiceInput): Promise<Service> {
    return prisma.service.create({
      data,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll(): Promise<Service[]> {
    return prisma.service.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  async findById(id: string): Promise<Service | null> {
    return prisma.service.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });
  }

  async findByCategoryId(categoryId: string): Promise<Service[]> {
    return prisma.service.findMany({
      where: { categoryId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  async update(id: string, data: UpdateServiceInput): Promise<Service> {
    return prisma.service.update({
      where: { id },
      data,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async delete(id: string): Promise<Service> {
    return prisma.service.delete({
      where: { id },
    });
  }
}
