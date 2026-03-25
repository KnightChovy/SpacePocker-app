import { useMutation, useQueryClient } from '@tanstack/react-query';
import { managerBuildingsApi } from '@/apis/manager/buildings.api';
import type { CreateBuildingPayload } from '@/types/user/types';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/stores/auth.store';

export const useCreateBuilding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateBuildingPayload) => {
      // Tự động lấy managerId từ user đã đăng nhập
      const currentUser = useAuthStore.getState().user;
      const payload = {
        ...body,
        managerId: body.managerId || currentUser?.id,
      };

      return managerBuildingsApi.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings', 'list'] });
      toast.success('Building created successfully!');
    },
    onError: error => {
      console.error('Create building error:', error);
      toast.error('Failed to create building. Please try again.');
    },
  });
};
