import axiosInstance from '@/lib/axios';
import type { ApiResponse } from '@/apis/api.types';
import type { BookingRequestForManager } from '@/types/user/booking-request-api';
import type { GetAllRoomsResponse } from '@/types/user/room-api';
import type { GetUsersResponse } from '@/types/admin/users-api';

import type { GetAdminDashboardSourcesResponse } from '@/types/admin/dashboard.api.types';

export type {
  AdminDashboardSources,
  GetAdminDashboardSourcesRequest,
  GetAdminDashboardSourcesResponse,
} from '@/types/admin/dashboard.api.types';

const getSources = async (): Promise<GetAdminDashboardSourcesResponse> => {
  const [
    usersAllResponse,
    usersManagersResponse,
    usersAdminsResponse,
    roomsResponse,
    bookingRequestsResponse,
  ] = await Promise.all([
    axiosInstance.get<ApiResponse<GetUsersResponse>>('/users', {
      params: { page: 1, limit: 100 },
    }),
    axiosInstance.get<ApiResponse<GetUsersResponse>>('/users', {
      params: { role: 'MANAGER', page: 1, limit: 100 },
    }),
    axiosInstance.get<ApiResponse<GetUsersResponse>>('/users', {
      params: { role: 'ADMIN', page: 1, limit: 1 },
    }),
    axiosInstance.get<ApiResponse<GetAllRoomsResponse>>('/rooms', {
      params: { limit: 100, offset: 0 },
    }),
    axiosInstance.get<ApiResponse<BookingRequestForManager[]>>(
      '/allBookingRequest'
    ),
  ]);

  return {
    usersAll: usersAllResponse.data.metadata,
    managerUsers: usersManagersResponse.data.metadata,
    adminUsers: usersAdminsResponse.data.metadata,
    rooms: roomsResponse.data.metadata,
    bookingRequests: bookingRequestsResponse.data.metadata ?? [],
  };
};

export const adminDashboardApi = {
  getSources,
};
