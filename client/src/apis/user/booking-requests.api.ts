import axiosInstance from '@/lib/axios';
import type { ApiResponse } from '@/apis/api.types';
import type { BookingRequestStatus } from '@/types/user/booking-request-api';

import type {
  CancelMyBookingRequestResponse,
  CheckInBookingResponse,
  CheckOutBookingResponse,
  CreateBookingRequestRequest,
  CreateBookingRequestResponse,
  ListMyBookingsResponse,
  ListMyBookingRequestsResponse,
} from '@/types/user/booking-requests.api.types';

export type {
  CancelMyBookingRequestRequest,
  CancelMyBookingRequestResponse,
  CreateBookingRequestRequest,
  CreateBookingRequestResponse,
  ListMyBookingsResponse,
  ListMyBookingRequestsRequest,
  ListMyBookingRequestsResponse,
  CheckInBookingResponse,
  CheckOutBookingResponse,
} from '@/types/user/booking-requests.api.types';

const listMine = async (
  status?: BookingRequestStatus
): Promise<ListMyBookingRequestsResponse> => {
  const response = await axiosInstance.get<
    ApiResponse<ListMyBookingRequestsResponse>
  >('/my-booking-requests', { params: status ? { status } : undefined });
  return response.data.metadata;
};

const create = async (
  payload: CreateBookingRequestRequest
): Promise<CreateBookingRequestResponse> => {
  const response = await axiosInstance.post<
    ApiResponse<CreateBookingRequestResponse>
  >('/booking-requests', payload);
  return response.data.metadata;
};

const cancelMine = async (
  bookingRequestId: string
): Promise<CancelMyBookingRequestResponse> => {
  const response = await axiosInstance.patch<
    ApiResponse<CancelMyBookingRequestResponse>
  >(`/my-booking-requests/${bookingRequestId}/cancel`);
  return response.data.metadata;
};

const cancelPaidBooking = async (
  bookingId: string
): Promise<CheckOutBookingResponse> => {
  const response = await axiosInstance.patch<
    ApiResponse<CheckOutBookingResponse>
  >(`/bookings/request/${bookingId}/cancel`);
  return response.data.metadata;
};

const listMyBookings = async (): Promise<ListMyBookingsResponse> => {
  const response =
    await axiosInstance.get<ApiResponse<ListMyBookingsResponse>>('/myBookings');
  return response.data.metadata;
};

const checkInBooking = async (
  bookingId: string
): Promise<CheckInBookingResponse> => {
  const response = await axiosInstance.post<
    ApiResponse<CheckInBookingResponse>
  >(`/bookings/${bookingId}/check-in`, {});
  return response.data.metadata;
};

const checkOutBooking = async (
  bookingId: string
): Promise<CheckOutBookingResponse> => {
  const response = await axiosInstance.post<
    ApiResponse<CheckOutBookingResponse>
  >(`/bookings/${bookingId}/check-out`, {});
  return response.data.metadata;
};

export const userBookingRequestsApi = {
  listMine,
  create,
  cancelMine,
  cancelPaidBooking,
  listMyBookings,
  checkInBooking,
  checkOutBooking,
};
