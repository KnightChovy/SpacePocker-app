import { useQuery } from '@tanstack/react-query';
import { managerRoomsApi } from '@/apis/manager/rooms.api';

export const useGetRoomById = (roomId?: string) => {
  return useQuery({
    queryKey: ['rooms', 'detail', roomId],
    enabled: Boolean(roomId),
    queryFn: async () => {
      return managerRoomsApi.getById(roomId as string);
    },
  });
};
