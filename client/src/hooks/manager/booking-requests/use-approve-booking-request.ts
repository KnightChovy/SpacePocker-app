import { useMutation, useQueryClient } from '@tanstack/react-query';
import { managerBookingRequestsApi } from '@/apis/manager/booking-requests.api';
import { toast } from 'react-toastify';
import { getApiErrorMessage } from '@/lib/utils';

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
      toast.success('Booking request approved successfully');
    },
    onError: error => {
      toast.error(
        getApiErrorMessage(error, 'Failed to approve booking request')
      );
    },
  });
};
