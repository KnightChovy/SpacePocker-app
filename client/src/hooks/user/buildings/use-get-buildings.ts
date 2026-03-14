import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import type {
  BuildingQueryParams,
  GetAllBuildingsResponse,
} from '@/types/types';

export const useGetBuildings = (params?: BuildingQueryParams) => {
  return useQuery({
    queryKey: ['user', 'buildings', 'list', params],
    queryFn: async () => {
      const response = await axiosInstance.get<{
        metadata: GetAllBuildingsResponse;
      }>('/buildings', { params });
      return response.data.metadata;
    },
  });
};
