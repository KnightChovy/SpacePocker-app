import axiosInstance from '@/lib/axios';
import type { ApiResponse } from '@/apis/api.types';
import type { BookingRequestForManager } from '@/types/user/booking-request-api';

import type {
  ApproveBookingRequestResponse,
  ListBookingRequestsForRoleRequest,
  ListBookingRequestsForRoleResponse,
  RefundCancelBookingRequestResponse,
  RejectBookingRequestResponse,
} from '@/types/manager/booking-requests.api.types';

export type {
  ApproveBookingRequestRequest,
  ApproveBookingRequestResponse,
  ListBookingRequestsForRoleRequest,
  ListBookingRequestsForRoleResponse,
  RefundCancelBookingRequestRequest,
  RefundCancelBookingRequestResponse,
  RejectBookingRequestRequest,
  RejectBookingRequestResponse,
} from '@/types/manager/booking-requests.api.types';

const listForRole = async (
  params: ListBookingRequestsForRoleRequest
): Promise<ListBookingRequestsForRoleResponse> => {
  const isAdmin = params.role === 'ADMIN';

  const response = await axiosInstance.get<
    ApiResponse<BookingRequestForManager[]>
  >(
    isAdmin ? '/allBookingRequest' : '/booking-requests',
    isAdmin
      ? undefined
      : {
          params: {
            ...(params.status ? { status: params.status } : {}),
          },
        }
  );

  const requests = response.data.metadata ?? [];

  if (isAdmin && params.status) {
    return requests.filter(request => request.status === params.status);
  }

  return requests;
};

const approve = async (
  bookingRequestId: string
): Promise<ApproveBookingRequestResponse> => {
  const response = await axiosInstance.patch<
    ApiResponse<ApproveBookingRequestResponse>
  >(`/booking-requests/approve/${bookingRequestId}`);
  return response.data.metadata;
};

const reject = async (
  bookingRequestId: string
): Promise<RejectBookingRequestResponse> => {
  const response = await axiosInstance.patch<
    ApiResponse<RejectBookingRequestResponse>
  >(`/booking-requests/reject/${bookingRequestId}`);
  return response.data.metadata;
};

const refundCancel = async (
  bookingRequestId: string,
  reason?: string
): Promise<RefundCancelBookingRequestResponse> => {
  const response = await axiosInstance.patch<
    ApiResponse<RefundCancelBookingRequestResponse>
  >(`/manager/bookings/${bookingRequestId}/refund-cancel`, {
    reason,
  });
  return response.data.metadata;
};

export const managerBookingRequestsApi = {
  listForRole,
  approve,
  reject,
  refundCancel,
};
