import { useQuery } from '@tanstack/react-query';
import { adminAmenitiesApi } from '@/apis/admin/amenities.api';

export const useGetAmenities = () => {
  return useQuery({
    queryKey: ['amenities', 'list'],
    queryFn: async () => {
      return adminAmenitiesApi.list();
    },
  });
};
