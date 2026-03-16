import { useQuery } from '@tanstack/react-query';

import axiosInstance from '@/lib/axios';
import type {
  BookingRequestStatus,
  MyBookingRequest,
} from '@/types/booking-request-api';

export const useGetMyBookingRequests = (status?: BookingRequestStatus) => {
  return useQuery({
    queryKey: ['booking-requests', 'user', 'my', { status }],
    queryFn: async () => {
      const response = await axiosInstance.get<{
        metadata: MyBookingRequest[];
      }>('/my-booking-requests', { params: status ? { status } : undefined });

      return response.data.metadata;
    },
  });
};
