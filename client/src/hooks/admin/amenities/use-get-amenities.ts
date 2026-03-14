import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import type { ApiAmenity } from '@/types/room-api';

export const useGetAmenities = () => {
  return useQuery({
    queryKey: ['amenities', 'list'],
    queryFn: async () => {
      const response = await axiosInstance.get<{ metadata: ApiAmenity[] }>(
        '/amenities'
      );
      return response.data.metadata;
    },
  });
};
