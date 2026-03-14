import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
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
      const current = new Set(currentAmenityIds ?? []);
      const next = new Set(nextAmenityIds ?? []);

      const toAttach = [...next].filter(id => !current.has(id));
      const toDetach = [...current].filter(id => !next.has(id));

      await Promise.all([
        ...toAttach.map(amenityId =>
          axiosInstance.post('/room-amenities', { roomId, amenityId })
        ),
        ...toDetach.map(amenityId =>
          axiosInstance.delete(`/room-amenities/${roomId}/${amenityId}`)
        ),
      ]);
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
