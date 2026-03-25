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
