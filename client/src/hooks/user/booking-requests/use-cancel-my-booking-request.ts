import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import type { MyBookingRequest } from '@/types/booking-request-api';

export const useCancelMyBookingRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingRequestId: string) => {
      const response = await axiosInstance.patch<{
        metadata: MyBookingRequest;
      }>(`/my-booking-requests/${bookingRequestId}/cancel`);

      return response.data.metadata;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['booking-requests', 'user', 'my'],
      });
    },
  });
};
