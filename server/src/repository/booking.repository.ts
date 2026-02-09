import { CheckOverlapInput, IBookingRepository } from "../interface/booking.repository.interface";
import { prisma } from "../lib/prisma";

export class BookingRepository implements IBookingRepository {
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
}
