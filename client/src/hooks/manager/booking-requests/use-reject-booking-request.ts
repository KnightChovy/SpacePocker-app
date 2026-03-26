import { useMutation, useQueryClient } from '@tanstack/react-query';
import { managerBookingRequestsApi } from '@/apis/manager/booking-requests.api';
import { toast } from 'react-toastify';
import { getApiErrorMessage } from '@/lib/utils';

export const useRejectBookingRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingRequestId: string) => {
      return managerBookingRequestsApi.reject(bookingRequestId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['booking-requests'],
      });
      toast.success('Booking request rejected successfully');
    },
    onError: error => {
      toast.error(
        getApiErrorMessage(error, 'Failed to reject booking request')
      );
    },
  });
};
