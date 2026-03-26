import { useQuery } from '@tanstack/react-query';
import { userRoomsApi } from '@/apis/user/rooms.api';
import type { SearchAvailableRoomsParams } from '@/types/user/room-api';

export const useSearchAvailableRooms = (
  params?: SearchAvailableRoomsParams,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ['user', 'rooms', 'search-available', params],
    queryFn: async () => {
      if (!params) {
        return {
          rooms: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        };
      }

      return userRoomsApi.searchAvailable(params);
    },
    enabled: options?.enabled ?? true,
  });
};
