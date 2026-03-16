import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import type { BookingRequestForManager } from '@/types/booking-request-api';

export const useRejectBookingRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingRequestId: string) => {
      const response = await axiosInstance.patch<{
        metadata: BookingRequestForManager;
      }>(`/booking-requests/reject/${bookingRequestId}`);

      return response.data.metadata;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['booking-requests', 'manager', 'list'],
      });
    },
  });
};
