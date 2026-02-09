import { prisma } from '../lib/prisma';
import {
  IBookingRequestRepository,
  CreateBookingRequestInput,
  CheckUserPendingOverlapInput,
} from '../interface/bookingRequest.repository.interface';

export class BookingRequestRepository implements IBookingRequestRepository {
  async create(data: CreateBookingRequestInput) {
    return prisma.bookingRequest.create({
      data,
    });
  }

  async findById(id: string) {
    return prisma.bookingRequest.findUnique({
      where: { id },
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
