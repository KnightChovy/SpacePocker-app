import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import type { BookingRequestForManager } from '@/types/booking-request-api';

export const useCancelBookingRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingRequestId: string) => {
      const response = await axiosInstance.patch<{
        metadata: BookingRequestForManager;
      }>(`/cancelBookings/${bookingRequestId}`);

      return response.data.metadata;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['booking-requests'],
      });
    },
  });
};
