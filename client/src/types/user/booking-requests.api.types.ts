import type {
  BookingRequestStatus,
  CreateBookingRequestPayload,
  CreateBookingRequestResult,
  MyBookingRequest,
} from '@/types/user/booking-request-api';

export type ListMyBookingRequestsRequest = { status?: BookingRequestStatus };
export type ListMyBookingRequestsResponse = MyBookingRequest[];

export type CreateBookingRequestRequest = CreateBookingRequestPayload;
export type CreateBookingRequestResponse = CreateBookingRequestResult;

export type CancelMyBookingRequestRequest = { bookingRequestId: string };
export type CancelMyBookingRequestResponse = MyBookingRequest;

export type MyBookingStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'CHECKED_IN';

export type MyBooking = {
  id: string;
  userId: string;
  roomId: string;
  startTime: string;
  endTime: string;
  purpose?: string | null;
  status: MyBookingStatus;
  createdAt: string;
};

export type ListMyBookingsResponse = {
  bookings: MyBooking[];
};

export type CheckInBookingResponse = {
  booking: MyBooking;
};

export type CheckOutBookingResponse = {
  booking: MyBooking;
};
