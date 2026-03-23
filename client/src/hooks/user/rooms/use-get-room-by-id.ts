import { useQuery } from '@tanstack/react-query';
import { userRoomsApi } from '@/apis/user/rooms.api';

export const useGetRoomById = (roomId?: string) => {
  return useQuery({
    queryKey: ['user', 'rooms', 'detail', roomId],
    enabled: Boolean(roomId),
    queryFn: async () => {
      return userRoomsApi.getById(roomId as string);
    },
  });
};
