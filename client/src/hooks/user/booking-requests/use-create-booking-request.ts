import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import type {
  CreateBookingRequestPayload,
  CreateBookingRequestResult,
} from '@/types/booking-request-api';

export const useCreateBookingRequest = () => {
  return useMutation({
    mutationFn: async (payload: CreateBookingRequestPayload) => {
      const response = await axiosInstance.post<{
        metadata: CreateBookingRequestResult;
      }>('/booking-requests', payload);
      return response.data.metadata;
    },
  });
};
