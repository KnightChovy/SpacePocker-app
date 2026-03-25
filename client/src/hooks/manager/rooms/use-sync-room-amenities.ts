import { useMutation, useQueryClient } from '@tanstack/react-query';
import { managerRoomsApi } from '@/apis/manager/rooms.api';
import { toast } from 'react-toastify';

export type SyncRoomAmenitiesInput = {
  roomId: string;
  currentAmenityIds: string[];
  nextAmenityIds: string[];
};

export const useSyncRoomAmenities = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      roomId,
      currentAmenityIds,
      nextAmenityIds,
    }: SyncRoomAmenitiesInput) => {
      await managerRoomsApi.syncAmenities({
        roomId,
        currentAmenityIds,
        nextAmenityIds,
      });
    },
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['rooms', 'list'] }),
        queryClient.invalidateQueries({
          queryKey: ['rooms', 'detail', variables.roomId],
        }),
      ]);
    },
    onError: error => {
      console.error('Sync room amenities error:', error);
      toast.error('Room updated, but failed to update amenities.');
    },
  });
};
