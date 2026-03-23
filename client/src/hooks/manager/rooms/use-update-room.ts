import { useMutation, useQueryClient } from '@tanstack/react-query';
import { managerRoomsApi } from '@/apis/manager/rooms.api';
import { toast } from 'react-toastify';
import type { UpdateRoomPayload } from '@/types/user/room-api';

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      roomId,
      body,
    }: {
      roomId: string;
      body: UpdateRoomPayload;
    }) => {
      return managerRoomsApi.update(roomId, body);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rooms', 'list'] });
      queryClient.invalidateQueries({
        queryKey: ['rooms', 'detail', variables.roomId],
      });
      toast.success('Room updated successfully!');
    },
    onError: error => {
      console.error('Update room error:', error);
      toast.error('Failed to update room. Please try again.');
    },
  });
};
