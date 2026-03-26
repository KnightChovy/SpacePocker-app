import { BookingRequest, Booking, PaymentMethod } from '@prisma/client';

export interface CreateBookingRequestInput {
  userId: string;
  roomId: string;
  startTime: Date;
  endTime: Date;
  purpose?: string;
  paymentMethod?: PaymentMethod;
}

export interface CheckUserPendingOverlapInput {
  userId: string;
  roomId: string;
  startTime: Date;
  endTime: Date;
}

export interface IBookingRequestRepository {
  create(data: CreateBookingRequestInput): Promise<BookingRequest>;

  findById(id: string): Promise<BookingRequest | null>;

  findOverlappingPendingRequests(
    input: CheckUserPendingOverlapInput,
  ): Promise<BookingRequest[]>;
}
