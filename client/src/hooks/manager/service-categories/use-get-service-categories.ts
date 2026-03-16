import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import type { ApiServiceCategory } from '@/types/booking-request-api';

export const useGetServiceCategoriesManager = () => {
  return useQuery({
    queryKey: ['service-categories', 'list'],
    queryFn: async () => {
      const response = await axiosInstance.get<{
        metadata: ApiServiceCategory[];
      }>('/service-categories');
      return response.data.metadata;
    },
  });
};
