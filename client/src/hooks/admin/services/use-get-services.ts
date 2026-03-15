import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import type { ApiService } from '@/types/booking-request-api';

export const useGetServices = () => {
  return useQuery({
    queryKey: ['services', 'list'],
    queryFn: async () => {
      const response = await axiosInstance.get<{ metadata: ApiService[] }>(
        '/services'
      );
      return response.data.metadata;
    },
  });
};
