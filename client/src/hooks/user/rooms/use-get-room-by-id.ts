import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import type { ApiRoom } from '@/types/room-api';

export const useGetRoomById = (roomId?: string) => {
  return useQuery({
    queryKey: ['user', 'rooms', 'detail', roomId],
    enabled: Boolean(roomId),
    queryFn: async () => {
      const response = await axiosInstance.get<{ metadata: { room: ApiRoom } }>(
        `/rooms/${roomId}`
      );
      return response.data.metadata.room;
    },
  });
};
