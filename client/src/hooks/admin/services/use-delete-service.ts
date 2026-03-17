import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { toast } from 'react-toastify';

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/services/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services', 'list'] });
      toast.success('Service deleted successfully!');
    },
    onError: error => {
      console.error('Delete service error:', error);
      toast.error('Failed to delete service.');
    },
  });
};
