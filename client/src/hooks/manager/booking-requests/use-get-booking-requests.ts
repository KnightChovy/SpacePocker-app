import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import type {
  BookingRequestForManager,
  BookingRequestStatus,
} from '@/types/booking-request-api';

export const useGetBookingRequestsForManager = (
  status?: BookingRequestStatus
) => {
  return useQuery({
    queryKey: ['booking-requests', 'manager', 'all'],
    queryFn: async () => {
      const response = await axiosInstance.get<{
        metadata: BookingRequestForManager[];
      }>('/allBookingRequest');

      return response.data.metadata ?? [];
    },
    select: requests =>
      status ? requests.filter(request => request.status === status) : requests,
  });
};
