import { useQuery } from '@tanstack/react-query';
import { userBuildingsApi } from '@/apis/user/buildings.api';
import type {
  BuildingQueryParams,
} from '@/types/user/types';

export const useGetBuildings = (params?: BuildingQueryParams) => {
  return useQuery({
    queryKey: ['user', 'buildings', 'list', params],
    queryFn: async () => {
      return userBuildingsApi.list(params);
    },
  });
};
