import { useMutation, useQueryClient } from '@tanstack/react-query';
import { managerBookingRequestsApi } from '@/apis/manager/booking-requests.api';
import { toast } from 'react-toastify';
import { getApiErrorMessage } from '@/lib/utils';

export const useCancelBookingRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookingRequestId,
      reason,
    }: {
      bookingRequestId: string;
      reason?: string;
    }) => {
      return managerBookingRequestsApi.refundCancel(bookingRequestId, reason);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['booking-requests'],
      });
      toast.success('Booking request cancelled successfully');
    },
    onError: error => {
      toast.error(
        getApiErrorMessage(error, 'Failed to cancel booking request')
      );
    },
  });
};
