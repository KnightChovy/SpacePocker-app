import type { BookingRequestForManager } from '@/types/user/booking-request-api';
import type { GetAllRoomsResponse } from '@/types/user/room-api';
import type { GetUsersResponse } from '@/types/admin/users-api';

export type AdminDashboardSources = {
  usersAll: GetUsersResponse;
  managerUsers: GetUsersResponse;
  adminUsers: GetUsersResponse;
  rooms: GetAllRoomsResponse;
  bookingRequests: BookingRequestForManager[];
};

export type GetAdminDashboardSourcesRequest = void;
export type GetAdminDashboardSourcesResponse = AdminDashboardSources;
