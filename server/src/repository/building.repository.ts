import { PrismaClient } from '@prisma/client';
import { IBuildingRepository } from '../interface/building.repository.interface';

export class BuildingRepository implements IBuildingRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: any) {
    return await this.prisma.building.create({
      data,
    });
  }

  async findById(id: string) {
    return await this.prisma.building.findUnique({
      where: { id },
      include: {
        rooms: true,
      },
    });
  }

  async findAll(filter?: any, orderBy?: any, limit?: number, offset?: number) {
    return await this.prisma.building.findMany({
      where: filter,
      orderBy: orderBy,
      take: limit,
      skip: offset,
      include: {
        rooms: true,
      },
    });
  }

  async count(filter?: any) {
    return await this.prisma.building.count({
      where: filter,
    });
  }

  async update(id: string, data: any) {
    return await this.prisma.building.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return await this.prisma.building.delete({
      where: { id },
    });
  }
}
