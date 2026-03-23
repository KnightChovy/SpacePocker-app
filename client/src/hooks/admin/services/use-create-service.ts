import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { adminServicesApi } from '@/apis/admin/services.api';

export interface CreateServicePayload {
  name: string;
  description?: string;
  price: number;
  categoryId: string;
}

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateServicePayload) => {
      return adminServicesApi.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services', 'list'] });
      toast.success('Service created successfully!');
    },
    onError: error => {
      console.error('Create service error:', error);
      toast.error('Failed to create service.');
    },
  });
};
