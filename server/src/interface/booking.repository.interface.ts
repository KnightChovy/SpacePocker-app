import { Booking } from '@prisma/client';

export interface CheckOverlapInput {
  roomId: string;
  startTime: Date;
  endTime: Date;
}

export interface IBookingRepository {
  findOverlappingApprovedBookings(input: CheckOverlapInput): Promise<Booking[]>;
}
