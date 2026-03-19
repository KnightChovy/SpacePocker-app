import axiosInstance from '@/lib/axios';
import type { ApiResponse } from '@/apis/api.types';
import type {
  BookingRequestStatus,
} from '@/types/user/booking-request-api';

import type {
  CancelMyBookingRequestResponse,
  CreateBookingRequestRequest,
  CreateBookingRequestResponse,
  ListMyBookingRequestsResponse,
} from '@/types/user/booking-requests.api.types';

export type {
  CancelMyBookingRequestRequest,
  CancelMyBookingRequestResponse,
  CreateBookingRequestRequest,
  CreateBookingRequestResponse,
  ListMyBookingRequestsRequest,
  ListMyBookingRequestsResponse,
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

export const userBookingRequestsApi = {
  listMine,
  create,
  cancelMine,
};
