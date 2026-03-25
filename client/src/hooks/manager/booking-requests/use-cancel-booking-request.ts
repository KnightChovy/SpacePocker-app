import { useMutation, useQueryClient } from '@tanstack/react-query';
import { managerBookingRequestsApi } from '@/apis/manager/booking-requests.api';

export const useCancelBookingRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingRequestId: string) => {
      return managerBookingRequestsApi.refundCancel(bookingRequestId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['booking-requests'],
      });
    },
  });
};
