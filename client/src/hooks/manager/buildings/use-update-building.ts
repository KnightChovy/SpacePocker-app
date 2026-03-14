import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import type { UpdateBuildingPayload, BuildingDetail } from '@/types/types';
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
      const response = await axiosInstance.patch<{
        metadata: { updateBuilding: BuildingDetail };
      }>(`/buildings/${id}`, body);
      return response.data.metadata.updateBuilding;
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
