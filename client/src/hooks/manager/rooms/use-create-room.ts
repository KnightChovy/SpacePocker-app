import { useMutation, useQueryClient } from '@tanstack/react-query';
import { managerRoomsApi } from '@/apis/manager/rooms.api';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/stores/auth.store';
import type { CreateRoomPayload } from '@/types/user/room-api';

export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: CreateRoomPayload) => {
      const currentUser = useAuthStore.getState().user;
      const payload: CreateRoomPayload = {
        ...body,
        managerId: body.managerId || currentUser?.id,
      };

      return managerRoomsApi.create(payload);
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
