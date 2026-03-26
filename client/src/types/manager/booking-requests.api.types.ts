import type {
  ApproveBookingRequestResult,
  BookingRequestForManager,
  BookingRequestStatus,
} from '@/types/user/booking-request-api';

export type ListBookingRequestsForRoleRequest = {
  role?: string;
  status?: BookingRequestStatus;
};
export type ListBookingRequestsForRoleResponse = BookingRequestForManager[];

export type ApproveBookingRequestRequest = { bookingRequestId: string };
export type ApproveBookingRequestResponse = ApproveBookingRequestResult;

export type RejectBookingRequestRequest = { bookingRequestId: string };
export type RejectBookingRequestResponse = BookingRequestForManager;

export type RefundCancelBookingRequestRequest = {
  bookingRequestId: string;
  reason?: string;
};
export type RefundCancelBookingRequestResponse = BookingRequestForManager;
