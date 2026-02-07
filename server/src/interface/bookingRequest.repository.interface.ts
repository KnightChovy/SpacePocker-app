import { BookingRequest, Booking, Room } from '@prisma/client';

export interface CreateBookingRequestInput {
  userId: string;
  roomId: string;
  startTime: Date;
  endTime: Date;
  purpose?: string;
}

export interface CheckOverlapInput {
  roomId: string;
  startTime: Date;
  endTime: Date;
}

export interface CheckUserPendingOverlapInput extends CheckOverlapInput {
  userId: string;
}

export interface IBookingRequestRepository {
  create(data: CreateBookingRequestInput): Promise<BookingRequest>;

  findById(id: string): Promise<BookingRequest | null>;

  findRoomById(roomId: string): Promise<Room | null>;

  findOverlappingApprovedBookings(input: CheckOverlapInput): Promise<Booking[]>;

  findOverlappingPendingRequests(
    input: CheckUserPendingOverlapInput,
  ): Promise<BookingRequest[]>;
}
//asdasdasd
