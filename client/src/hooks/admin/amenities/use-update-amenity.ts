import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import type { ApiAmenity } from '@/types/room-api';
import { toast } from 'react-toastify';

export const useUpdateAmenity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { id: string; name: string }) => {
      const response = await axiosInstance.put<{ metadata: ApiAmenity }>(
        `/amenities/${payload.id}`,
        { name: payload.name }
      );
      return response.data.metadata;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amenities', 'list'] });
      toast.success('Amenity updated successfully!');
    },
    onError: error => {
      console.error('Update amenity error:', error);
      toast.error('Failed to update amenity.');
    },
  });
};
