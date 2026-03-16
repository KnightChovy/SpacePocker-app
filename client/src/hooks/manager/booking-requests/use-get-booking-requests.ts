import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import type {
  BookingRequestForManager,
  BookingRequestStatus,
} from '@/types/booking-request-api';

export const useGetBookingRequestsForManager = (
  status: BookingRequestStatus
) => {
  return useQuery({
    queryKey: ['booking-requests', 'manager', 'list', { status }],
    queryFn: async () => {
      const response = await axiosInstance.get<{
        metadata: BookingRequestForManager[];
      }>('/booking-requests', { params: { status } });

      return response.data.metadata;
    },
  });
};
