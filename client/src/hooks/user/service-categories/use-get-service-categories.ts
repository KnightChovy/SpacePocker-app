import { useQuery } from '@tanstack/react-query';

import axiosInstance from '@/lib/axios';
import type { ApiServiceCategory } from '@/types/booking-request-api';

type ApiServiceCategoryFromServer = ApiServiceCategory & {
  manager?: {
    id: string;
    name: string;
    email?: string;
  };
};

export const useGetServiceCategories = () => {
  return useQuery({
    queryKey: ['user', 'service-categories', 'list'],
    queryFn: async () => {
      const response = await axiosInstance.get<{
        metadata: ApiServiceCategoryFromServer[];
      }>('/service-categories');

      // The booking UI only needs the category fields + services.
      return response.data.metadata.map(cat => ({
        id: cat.id,
        name: cat.name,
        description: cat.description ?? null,
        services: cat.services ?? [],
      }));
    },
  });
};
