import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { toast } from 'react-toastify';

export const useDeleteServiceCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/service-categories/${id}`);
      return id;
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
