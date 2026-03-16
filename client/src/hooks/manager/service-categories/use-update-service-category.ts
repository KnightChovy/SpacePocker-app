import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { toast } from 'react-toastify';
import type { ApiServiceCategory } from '@/types/booking-request-api';

export interface UpdateServiceCategoryPayload {
  id: string;
  name: string;
  description?: string;
}

export const useUpdateServiceCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateServiceCategoryPayload) => {
      const response = await axiosInstance.put<{
        metadata: ApiServiceCategory;
      }>(`/service-categories/${payload.id}`, {
        name: payload.name,
        description: payload.description,
      });
      return response.data.metadata;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['service-categories', 'list'],
      });
      queryClient.invalidateQueries({
        queryKey: ['user', 'service-categories', 'list'],
      });
      toast.success('Service category updated successfully!');
    },
    onError: error => {
      console.error('Update service category error:', error);
      toast.error('Failed to update service category.');
    },
  });
};
