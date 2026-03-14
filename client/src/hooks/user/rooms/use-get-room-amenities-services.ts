import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import type { RoomAmenitiesServicesResponse } from '@/types/booking-request-api';

export const useGetRoomAmenitiesServices = (roomId?: string) => {
  return useQuery({
    queryKey: ['user', 'rooms', roomId, 'amenities-services'],
    enabled: Boolean(roomId),
    queryFn: async () => {
      const response = await axiosInstance.get<{
        metadata: RoomAmenitiesServicesResponse;
      }>(`/rooms/${roomId}/amenities-services`);
      return response.data.metadata;
    },
  });
};
