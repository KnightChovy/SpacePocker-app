import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { toast } from 'react-toastify';
import type { ApiRoom, UpdateRoomPayload } from '@/types/room-api';

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
      const response = await axiosInstance.patch<{
        metadata: { room: ApiRoom };
      }>(`/rooms/${roomId}`, body);
      return response.data.metadata.room;
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
