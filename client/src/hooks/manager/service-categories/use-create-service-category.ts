import { useMutation, useQueryClient } from '@tanstack/react-query';
import { managerServiceCategoriesApi } from '@/apis/manager/service-categories.api';
import { toast } from 'react-toastify';

export interface CreateServiceCategoryPayload {
  name: string;
  description?: string;
  managerId: string;
}

export const useCreateServiceCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateServiceCategoryPayload) => {
      return managerServiceCategoriesApi.create(payload);
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
