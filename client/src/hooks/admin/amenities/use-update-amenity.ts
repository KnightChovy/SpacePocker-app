import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAmenitiesApi } from '@/apis/admin/amenities.api';
import { toast } from 'react-toastify';

export const useUpdateAmenity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { id: string; name: string }) => {
      return adminAmenitiesApi.update(payload);
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
