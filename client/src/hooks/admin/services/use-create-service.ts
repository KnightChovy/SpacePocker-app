import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { toast } from 'react-toastify';
import type { ApiService } from '@/types/booking-request-api';

export interface CreateServicePayload {
  name: string;
  description?: string;
  price: number;
  categoryId: string;
}

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateServicePayload) => {
      const response = await axiosInstance.post<{ metadata: ApiService }>(
        '/services',
        payload
      );
      return response.data.metadata;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services', 'list'] });
      toast.success('Service created successfully!');
    },
    onError: error => {
      console.error('Create service error:', error);
      toast.error('Failed to create service.');
    },
  });
};
