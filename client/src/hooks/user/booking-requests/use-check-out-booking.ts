import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userBookingRequestsApi } from '@/apis/user/booking-requests.api';

export const useCheckOutBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      return userBookingRequestsApi.checkOutBooking(bookingId);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['bookings', 'user', 'my'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['booking-requests', 'user', 'my'],
        }),
      ]);
    },
  });
};
