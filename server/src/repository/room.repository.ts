import { IRoomRepository } from '../interface/room.repository.interface';
import { prisma } from '../lib/prisma';
import { RoomType } from '@prisma/client';

export class RoomRepository implements IRoomRepository {
  async findById(roomId: string) {
    return prisma.room.findUnique({
      where: { id: roomId },
      include: {
        building: true,
        manager: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
        serviceCategories: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async create(data: {
    buildingId: string;
    managerId: string;
    name: string;
    description?: string;
    pricePerHour: number;
    securityDeposit?: number;
    capacity: number;
    roomType: RoomType;
    area?: number;
    roomCode: string;
    images?: string[];
    amenities?: string[];
    serviceCategories?: string[];
  }) {
    const { amenities, serviceCategories, images, ...roomData } = data;

    return prisma.room.create({
      data: {
        ...roomData,
        images: images || [],
        amenities:
          amenities && amenities.length > 0
            ? {
                create: amenities.map((id) => ({
                  amenity: { connect: { id } },
                })),
              }
            : undefined,
        serviceCategories:
          serviceCategories && serviceCategories.length > 0
            ? {
                create: serviceCategories.map((id) => ({
                  category: { connect: { id } },
                })),
              }
            : undefined,
      },
      include: {
        building: true,
        manager: true,
        amenities: { include: { amenity: true } },
        serviceCategories: { include: { category: true } },
      },
    });
  }

  async findAll(
    filter?: any,
    orderBy?: any,
    limit: number = 10,
    offset: number = 0,
  ) {
    return prisma.room.findMany({
      where: filter,
      orderBy,
      take: limit,
      skip: offset,
      include: {
        building: true,
        manager: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
        serviceCategories: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async update(
    roomId: string,
    data: {
      name?: string;
      description?: string;
      pricePerHour?: number;
      securityDeposit?: number;
      capacity?: number;
      roomType?: RoomType;
      area?: number;
      status?: import('@prisma/client').RoomStatus;
      images?: string[];
      amenities?: string[];
      serviceCategories?: string[];
    },
  ) {
    const { amenities, serviceCategories, images, ...roomData } = data;

    return prisma.room.update({
      where: { id: roomId },
      data: {
        ...roomData,
        ...(images !== undefined && { images }),
        ...(amenities !== undefined && {
          amenities: {
            deleteMany: {},
            create: amenities.map((id) => ({
              amenity: { connect: { id } },
            })),
          },
        }),
        ...(serviceCategories !== undefined && {
          serviceCategories: {
            deleteMany: {},
            create: serviceCategories.map((id) => ({
              category: { connect: { id } },
            })),
          },
        }),
      },
      include: {
        building: true,
        manager: true,
        amenities: { include: { amenity: true } },
        serviceCategories: { include: { category: true } },
      },
    });
  }

  async delete(roomId: string) {
    return prisma.room.delete({
      where: { id: roomId },
    });
  }

  async count(filter?: any) {
    return prisma.room.count({
      where: filter,
    });
  }

  async findByRoomCode(roomCode: string) {
    return prisma.room.findUnique({
      where: { roomCode },
    });
  }
}
