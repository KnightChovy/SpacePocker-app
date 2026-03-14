import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/stores/auth.store';
import type { ApiRoom, CreateRoomPayload } from '@/types/room-api';

export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: CreateRoomPayload) => {
      const currentUser = useAuthStore.getState().user;
      const payload: CreateRoomPayload = {
        ...body,
        managerId: body.managerId || currentUser?.id,
      };

      const response = await axiosInstance.post<{
        metadata: { room: ApiRoom };
      }>('/rooms', payload);
      return response.data.metadata.room;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms', 'list'] });
      toast.success('Room created successfully!');
    },
    onError: error => {
      console.error('Create room error:', error);
      toast.error('Failed to create room. Please try again.');
    },
  });
};
