import { useQuery } from '@tanstack/react-query';
import { managerBuildingsApi } from '@/apis/manager/buildings.api';
import type {
  BuildingQueryParams,
} from '@/types/user/types';

export const useGetBuildings = (params?: BuildingQueryParams) => {
  return useQuery({
    queryKey: ['buildings', 'list', params],
    queryFn: async () => {
      return managerBuildingsApi.list(params);
    },
  });
};
