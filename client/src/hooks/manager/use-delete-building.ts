import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { toast } from 'react-toastify';

export const useDeleteBuilding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete<{
        metadata: { message: string };
      }>(`/building/${id}`);
      return response.data.metadata;
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['buildings', 'list'] });
      queryClient.removeQueries({ queryKey: ['buildings', 'detail', id] });
      toast.success('Building deleted successfully!');
    },
    onError: error => {
      console.error('Delete building error:', error);
      toast.error('Failed to delete building. Please try again.');
    },
  });
};
