import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAmenitiesApi } from '@/apis/admin/amenities.api';
import { toast } from 'react-toastify';

export const useCreateAmenity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { name: string }) => {
      return adminAmenitiesApi.create(payload);
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
