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
  }) {
    return prisma.room.create({
      data,
      include: {
        building: true,
        manager: true,
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
    },
  ) {
    return prisma.room.update({
      where: { id: roomId },
      data,
      include: {
        building: true,
        manager: true,
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
