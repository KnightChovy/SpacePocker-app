import { prisma } from '../lib/prisma';
import {
  IBookingRequestRepository,
  CreateBookingRequestInput,
  CheckOverlapInput,
  CheckUserPendingOverlapInput,
} from '../interface/bookingRequest.repository.interface';

export class BookingRequestRepository implements IBookingRequestRepository {
  async create(data: CreateBookingRequestInput) {
    return prisma.bookingRequest.create({
      data: {
        userId: data.userId,
        roomId: data.roomId,
        startTime: data.startTime,
        endTime: data.endTime,
        purpose: data.purpose,
      },
      include: {
        room: {
          select: {
            id: true,
            name: true,
            roomCode: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return prisma.bookingRequest.findUnique({
      where: { id },
      include: {
        room: true,
        user: true,
      },
    });
  }

  async findRoomById(roomId: string) {
    return prisma.room.findUnique({
      where: { id: roomId },
    });
  }

  async findOverlappingApprovedBookings(input: CheckOverlapInput) {
    return prisma.booking.findMany({
      where: {
        roomId: input.roomId,
        status: 'APPROVED',
        AND: [
          { startTime: { lt: input.endTime } },
          { endTime: { gt: input.startTime } },
        ],
      },
    });
  }

  async findOverlappingPendingRequests(input: CheckUserPendingOverlapInput) {
    return prisma.bookingRequest.findMany({
      where: {
        roomId: input.roomId,
        userId: input.userId,
        status: 'PENDING',
        AND: [
          { startTime: { lt: input.endTime } },
          { endTime: { gt: input.startTime } },
        ],
      },
    });
  }
}
