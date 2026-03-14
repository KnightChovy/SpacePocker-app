import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { toast } from 'react-toastify';

type AttachRoomAmenitiesInput = {
  roomId: string;
  amenityIds: string[];
};

export const useAttachRoomAmenities = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roomId, amenityIds }: AttachRoomAmenitiesInput) => {
      const ids = amenityIds ?? [];
      if (ids.length === 0) return;

      await Promise.all(
        ids.map(amenityId =>
          axiosInstance.post('/room-amenities', { roomId, amenityId })
        )
      );
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
