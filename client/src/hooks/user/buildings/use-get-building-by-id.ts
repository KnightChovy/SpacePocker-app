import { useQuery } from '@tanstack/react-query';
import { userBuildingsApi } from '@/apis/user/buildings.api';

export const useGetBuildingById = (id?: string) => {
  return useQuery({
    queryKey: ['user', 'buildings', 'detail', id],
    enabled: Boolean(id),
    queryFn: async () => {
      return userBuildingsApi.getById(id as string);
    },
  });
};
