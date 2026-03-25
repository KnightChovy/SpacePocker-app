import { useQuery } from '@tanstack/react-query';
import { managerRoomsApi } from '@/apis/manager/rooms.api';
import type { RoomQueryParams } from '@/types/user/room-api';

export const useGetRooms = (params?: RoomQueryParams) => {
  return useQuery({
    queryKey: ['rooms', 'list', params],
    queryFn: async () => {
      return managerRoomsApi.list(params);
    },
  });
};
