import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import type { GetAllRoomsResponse, RoomQueryParams } from '@/types/room-api';

export const useGetRooms = (params?: RoomQueryParams) => {
  return useQuery({
    queryKey: ['rooms', 'list', params],
    queryFn: async () => {
      const response = await axiosInstance.get<{
        metadata: GetAllRoomsResponse;
      }>('/rooms', { params });
      return response.data.metadata;
    },
  });
};
