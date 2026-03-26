import { useQuery } from '@tanstack/react-query';
import { userRoomsApi } from '@/apis/user/rooms.api';
import type { RoomQueryParams } from '@/types/user/room-api';

export const useGetRooms = (
  params?: RoomQueryParams,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ['user', 'rooms', 'list', params],
    queryFn: async () => {
      return userRoomsApi.list(params);
    },
    enabled: options?.enabled ?? true,
  });
};
