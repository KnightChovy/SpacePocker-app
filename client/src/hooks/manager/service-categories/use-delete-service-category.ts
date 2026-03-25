import { useMutation, useQueryClient } from '@tanstack/react-query';
import { managerServiceCategoriesApi } from '@/apis/manager/service-categories.api';
import { toast } from 'react-toastify';

export const useDeleteServiceCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return managerServiceCategoriesApi.remove(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['service-categories', 'list'],
      });
      queryClient.invalidateQueries({
        queryKey: ['user', 'service-categories', 'list'],
      });
      toast.success('Service category deleted successfully!');
    },
    onError: error => {
      console.error('Delete service category error:', error);
      toast.error('Failed to delete service category.');
    },
  });
};
