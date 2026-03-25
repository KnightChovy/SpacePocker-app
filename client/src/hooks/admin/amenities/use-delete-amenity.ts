import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAmenitiesApi } from '@/apis/admin/amenities.api';
import { toast } from 'react-toastify';

export const useDeleteAmenity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return adminAmenitiesApi.remove(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amenities', 'list'] });
      toast.success('Amenity deleted successfully!');
    },
    onError: error => {
      console.error('Delete amenity error:', error);
      toast.error('Failed to delete amenity.');
    },
  });
};
