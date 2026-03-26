import { prisma } from "../lib/prisma";
import {
  IBookingRequestRepository,
  CreateBookingRequestInput,
  CheckUserPendingOverlapInput,
} from "../interface/bookingRequest.repository.interface";

export class BookingRequestRepository implements IBookingRequestRepository {
  async create(data: CreateBookingRequestInput) {
    return prisma.bookingRequest.create({
      data,
    });
  }

  async findById(id: string) {
    return prisma.bookingRequest.findUnique({
      where: { id },
      include: {
        room: {
          select: {
            id: true,
            name: true,
            roomCode: true,
            building: {
              select: {
                id: true,
                buildingName: true,
              },
            },
            amenities: {
              include: {
                amenity: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        services: {
          include: {
            service: true,
          },
        },
      },
    });
  }

  async findOverlappingPendingRequests(input: CheckUserPendingOverlapInput) {
    return prisma.bookingRequest.findMany({
      where: {
        roomId: input.roomId,
        userId: input.userId,
        status: "PENDING",
        AND: [
          { startTime: { lt: input.endTime } },
          { endTime: { gt: input.startTime } },
        ],
      },
    });
  }
}
