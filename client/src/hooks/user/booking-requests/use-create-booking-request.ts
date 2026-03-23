import { useMutation } from '@tanstack/react-query';
import { userBookingRequestsApi } from '@/apis/user/booking-requests.api';
import type { CreateBookingRequestPayload } from '@/types/user/booking-request-api';

export const useCreateBookingRequest = () => {
  return useMutation({
    mutationFn: async (payload: CreateBookingRequestPayload) => {
      return userBookingRequestsApi.create(payload);
    },
  });
};
