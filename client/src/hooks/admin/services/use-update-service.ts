import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminServicesApi } from '@/apis/admin/services.api';
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
      return adminServicesApi.update(payload);
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
