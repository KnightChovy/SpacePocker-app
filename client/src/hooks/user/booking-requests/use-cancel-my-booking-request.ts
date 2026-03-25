import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userBookingRequestsApi } from '@/apis/user/booking-requests.api';

export const useCancelMyBookingRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingRequestId: string) => {
      return userBookingRequestsApi.cancelMine(bookingRequestId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['booking-requests', 'user', 'my'],
      });
    },
  });
};
