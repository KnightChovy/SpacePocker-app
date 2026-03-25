import { useMutation, useQueryClient } from '@tanstack/react-query';
import { managerRoomsApi } from '@/apis/manager/rooms.api';
import { toast } from 'react-toastify';

type AttachRoomAmenitiesInput = {
  roomId: string;
  amenityIds: string[];
};

export const useAttachRoomAmenities = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roomId, amenityIds }: AttachRoomAmenitiesInput) => {
      await managerRoomsApi.attachAmenities(roomId, amenityIds);
    },
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['rooms', 'list'] }),
        queryClient.invalidateQueries({
          queryKey: ['rooms', 'detail', variables.roomId],
        }),
      ]);

      toast.success('Amenities added to room successfully!');
    },
    onError: error => {
      console.error('Attach room amenities error:', error);
      toast.error('Room created, but failed to attach amenities.');
    },
  });
};
