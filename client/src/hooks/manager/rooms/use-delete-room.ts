import { useMutation, useQueryClient } from '@tanstack/react-query';
import { managerRoomsApi } from '@/apis/manager/rooms.api';
import { toast } from 'react-toastify';

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roomId: string) => {
      return managerRoomsApi.remove(roomId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms', 'list'] });
      toast.success('Room deleted successfully!');
    },
    onError: error => {
      console.error('Delete room error:', error);
      toast.error('Failed to delete room. Please try again.');
    },
  });
};
