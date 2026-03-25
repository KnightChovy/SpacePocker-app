import { useMutation, useQueryClient } from '@tanstack/react-query';
import { managerServiceCategoriesApi } from '@/apis/manager/service-categories.api';
import { toast } from 'react-toastify';

export interface UpdateServiceCategoryPayload {
  id: string;
  name: string;
  description?: string;
}

export const useUpdateServiceCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateServiceCategoryPayload) => {
      return managerServiceCategoriesApi.update(payload);
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
