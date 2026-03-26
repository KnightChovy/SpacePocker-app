import { useQuery } from '@tanstack/react-query';
import { userBookingRequestsApi } from '@/apis/user/booking-requests.api';

export const useGetMyBookings = () => {
  return useQuery({
    queryKey: ['bookings', 'user', 'my'],
    queryFn: async () => {
      const response = await userBookingRequestsApi.listMyBookings();
      return response.bookings;
    },
  });
};
