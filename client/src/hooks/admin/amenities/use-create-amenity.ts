import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import type { ApiAmenity } from '@/types/room-api';
import { toast } from 'react-toastify';

export const useCreateAmenity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { name: string }) => {
      const response = await axiosInstance.post<{ metadata: ApiAmenity }>(
        '/amenities',
        payload
      );
      return response.data.metadata;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amenities', 'list'] });
      toast.success('Amenity created successfully!');
    },
    onError: error => {
      console.error('Create amenity error:', error);
      toast.error('Failed to create amenity.');
    },
  });
};
