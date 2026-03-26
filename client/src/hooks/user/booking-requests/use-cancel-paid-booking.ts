import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userBookingRequestsApi } from '@/apis/user/booking-requests.api';

export const useCancelPaidBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      return userBookingRequestsApi.cancelPaidBooking(bookingId);
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
