import { useQuery } from '@tanstack/react-query';
import { managerBuildingsApi } from '@/apis/manager/buildings.api';

export const useGetBuildingById = (id: string) => {
  return useQuery({
    queryKey: ['buildings', 'detail', id],
    queryFn: async () => {
      return managerBuildingsApi.getById(id);
    },
    enabled: !!id,
  });
};
