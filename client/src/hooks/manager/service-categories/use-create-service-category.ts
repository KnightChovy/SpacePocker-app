import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { toast } from 'react-toastify';
import type { ApiServiceCategory } from '@/types/booking-request-api';

export interface CreateServiceCategoryPayload {
  name: string;
  description?: string;
  managerId: string;
}

export const useCreateServiceCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateServiceCategoryPayload) => {
      const response = await axiosInstance.post<{
        metadata: ApiServiceCategory;
      }>('/service-categories', payload);
      return response.data.metadata;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['service-categories', 'list'],
      });
      queryClient.invalidateQueries({
        queryKey: ['user', 'service-categories', 'list'],
      });
      toast.success('Service category created successfully!');
    },
    onError: error => {
      console.error('Create service category error:', error);
      toast.error('Failed to create service category.');
    },
  });
};
