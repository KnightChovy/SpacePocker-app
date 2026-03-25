import { useQuery } from '@tanstack/react-query';

import { userBookingRequestsApi } from '@/apis/user/booking-requests.api';
import type { BookingRequestStatus } from '@/types/user/booking-request-api';

export const useGetMyBookingRequests = (status?: BookingRequestStatus) => {
  return useQuery({
    queryKey: ['booking-requests', 'user', 'my', { status }],
    queryFn: async () => {
      return userBookingRequestsApi.listMine(status);
    },
  });
};
