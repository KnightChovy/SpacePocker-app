import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminServicesApi } from '@/apis/admin/services.api';
import { toast } from 'react-toastify';

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return adminServicesApi.remove(id);
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
