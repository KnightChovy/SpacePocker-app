import { prisma } from "../lib/prisma";
import {
  IAmenityRepository,
  CreateAmenityInput,
  UpdateAmenityInput,
  CreateRoomAmenityInput,
} from "../interface/amenity.repository.interface";
import { Amenity, RoomAmenity } from "@prisma/client";

export class AmenityRepository implements IAmenityRepository {
  async create(data: CreateAmenityInput): Promise<Amenity> {
    return prisma.amenity.create({
      data,
    });
  }

  async findAll(): Promise<Amenity[]> {
    return prisma.amenity.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  async findById(id: string): Promise<Amenity | null> {
    return prisma.amenity.findUnique({
      where: { id },
    });
  }

  async findByName(name: string): Promise<Amenity | null> {
    return prisma.amenity.findUnique({
      where: { name },
    });
  }

  async update(id: string, data: UpdateAmenityInput): Promise<Amenity> {
    return prisma.amenity.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Amenity> {
    return prisma.amenity.delete({
      where: { id },
    });
  }

  async addRoomAmenity(data: CreateRoomAmenityInput): Promise<RoomAmenity> {
    return prisma.roomAmenity.create({
      data,
      include: {
        room: {
          select: {
            id: true,
            name: true,
            roomCode: true,
          },
        },
        amenity: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async removeRoomAmenity(
    roomId: string,
    amenityId: string,
  ): Promise<RoomAmenity> {
    return prisma.roomAmenity.delete({
      where: {
        roomId_amenityId: {
          roomId,
          amenityId,
        },
      },
    });
  }

  async findRoomAmenity(
    roomId: string,
    amenityId: string,
  ): Promise<RoomAmenity | null> {
    return prisma.roomAmenity.findUnique({
      where: {
        roomId_amenityId: {
          roomId,
          amenityId,
        },
      },
    });
  }
}
