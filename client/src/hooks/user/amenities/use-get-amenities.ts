import { useQuery } from '@tanstack/react-query';

import { userAmenitiesApi } from '@/apis/user/amenities.api';

export const useGetAmenities = () => {
  return useQuery({
    queryKey: ['user', 'amenities', 'list'],
    queryFn: async () => {
      return userAmenitiesApi.list();
    },
  });
};
