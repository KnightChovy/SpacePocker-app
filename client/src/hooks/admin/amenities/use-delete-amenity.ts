import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { toast } from 'react-toastify';

export const useDeleteAmenity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/amenities/${id}`);
      return id;
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
