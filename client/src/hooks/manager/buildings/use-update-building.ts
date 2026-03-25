import { useMutation, useQueryClient } from '@tanstack/react-query';
import { managerBuildingsApi } from '@/apis/manager/buildings.api';
import type { UpdateBuildingPayload } from '@/types/user/types';
import { toast } from 'react-toastify';

export const useUpdateBuilding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: string;
      body: UpdateBuildingPayload;
    }) => {
      return managerBuildingsApi.update(id, body);
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['buildings', 'detail', id] });
      queryClient.invalidateQueries({ queryKey: ['buildings', 'list'] });
      toast.success('Building updated successfully!');
    },
    onError: error => {
      console.error('Update building error:', error);
      toast.error('Failed to update building. Please try again.');
    },
  });
};
