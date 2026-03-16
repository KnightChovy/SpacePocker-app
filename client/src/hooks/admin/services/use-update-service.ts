import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import type { ApiService } from '@/types/booking-request-api';
import { toast } from 'react-toastify';

export interface UpdateServicePayload {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
}

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateServicePayload) => {
      const response = await axiosInstance.put<{ metadata: ApiService }>(
        `/services/${payload.id}`,
        {
          name: payload.name,
          description: payload.description,
          price: payload.price,
          categoryId: payload.categoryId,
        }
      );
      return response.data.metadata;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services', 'list'] });
      toast.success('Service updated successfully!');
    },
    onError: error => {
      console.error('Update service error:', error);
      toast.error('Failed to update service.');
    },
  });
};
