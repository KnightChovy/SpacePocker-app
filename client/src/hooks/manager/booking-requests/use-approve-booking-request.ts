import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import type { ApproveBookingRequestResult } from '@/types/booking-request-api';

export const useApproveBookingRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingRequestId: string) => {
      const response = await axiosInstance.patch<{
        metadata: ApproveBookingRequestResult;
      }>(`/booking-requests/approve/${bookingRequestId}`);

      return response.data.metadata;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['booking-requests', 'manager', 'list'],
      });
    },
  });
};
