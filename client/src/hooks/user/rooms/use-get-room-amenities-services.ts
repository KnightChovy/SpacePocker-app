import { useQuery } from '@tanstack/react-query';
import { userRoomsApi } from '@/apis/user/rooms.api';

export const useGetRoomAmenitiesServices = (roomId?: string) => {
  return useQuery({
    queryKey: ['user', 'rooms', roomId, 'amenities-services'],
    enabled: Boolean(roomId),
    queryFn: async () => {
      return userRoomsApi.getAmenitiesServices(roomId as string);
    },
  });
};
