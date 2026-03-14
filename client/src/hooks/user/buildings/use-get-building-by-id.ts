import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import type { BuildingDetail } from '@/types/types';

export const useGetBuildingById = (id?: string) => {
  return useQuery({
    queryKey: ['user', 'buildings', 'detail', id],
    enabled: Boolean(id),
    queryFn: async () => {
      const response = await axiosInstance.get<{
        metadata: { building: BuildingDetail };
      }>(`/buildings/${id}`);
      return response.data.metadata.building;
    },
  });
};
