import { prisma } from "../lib/prisma";
import {
  IServiceCategoryRepository,
  CreateServiceCategoryInput,
  UpdateServiceCategoryInput,
  AddRoomServiceCategoryInput,
} from "../interface/serviceCategory.repository.interface";
import { ServiceCategory, RoomServiceCategory } from "@prisma/client";

export class ServiceCategoryRepository implements IServiceCategoryRepository {
  async create(data: CreateServiceCategoryInput): Promise<ServiceCategory> {
    return prisma.serviceCategory.create({
      data,
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        services: true,
      },
    });
  }

  async findAll(): Promise<ServiceCategory[]> {
    return prisma.serviceCategory.findMany({
      include: {
        manager: {
          select: {
            id: true,
            name: true,
          },
        },
        services: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  async findById(id: string): Promise<ServiceCategory | null> {
    return prisma.serviceCategory.findUnique({
      where: { id },
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        services: true,
      },
    });
  }

  async findByName(name: string): Promise<ServiceCategory | null> {
    return prisma.serviceCategory.findUnique({
      where: { name },
    });
  }

  async update(
    id: string,
    data: UpdateServiceCategoryInput,
  ): Promise<ServiceCategory> {
    return prisma.serviceCategory.update({
      where: { id },
      data,
      include: {
        manager: {
          select: {
            id: true,
            name: true,
          },
        },
        services: true,
      },
    });
  }

  async delete(id: string): Promise<ServiceCategory> {
    return prisma.serviceCategory.delete({
      where: { id },
    });
  }

  async addRoomServiceCategory(
    data: AddRoomServiceCategoryInput,
  ): Promise<RoomServiceCategory> {
    return prisma.roomServiceCategory.create({
      data,
      include: {
        room: {
          select: {
            id: true,
            name: true,
            roomCode: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async removeRoomServiceCategory(
    roomId: string,
    categoryId: string,
  ): Promise<RoomServiceCategory> {
    return prisma.roomServiceCategory.delete({
      where: {
        roomId_categoryId: {
          roomId,
          categoryId,
        },
      },
      include: {
        room: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findRoomServiceCategory(
    roomId: string,
    categoryId: string,
  ): Promise<RoomServiceCategory | null> {
    return prisma.roomServiceCategory.findUnique({
      where: {
        roomId_categoryId: {
          roomId,
          categoryId,
        },
      },
    });
  }
}
