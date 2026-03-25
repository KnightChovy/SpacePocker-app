import { useMutation, useQueryClient } from '@tanstack/react-query';
import { managerBookingRequestsApi } from '@/apis/manager/booking-requests.api';

export const useApproveBookingRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingRequestId: string) => {
      return managerBookingRequestsApi.approve(bookingRequestId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['booking-requests'],
      });
    },
  });
};
