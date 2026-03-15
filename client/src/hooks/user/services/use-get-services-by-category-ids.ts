import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import axiosInstance from '@/lib/axios';
import type { ApiService, ApiServiceCategory } from '@/types/booking-request-api';

type ServicesByCategoryId = Record<string, ApiService[]>;

export const useGetServicesByCategoryIds = (categoryIds?: string[]) => {
  const stableIds = useMemo(() => {
    const ids = (categoryIds ?? []).filter(Boolean);
    const unique = Array.from(new Set(ids));
    unique.sort();
    return unique;
  }, [categoryIds]);

  return useQuery({
    queryKey: ['user', 'service-categories', 'by-ids', stableIds],
    enabled: stableIds.length > 0,
    queryFn: async () => {
      const results = await Promise.all(
        stableIds.map(id =>
          axiosInstance.get<{ metadata: ApiServiceCategory & { services: ApiService[] } }>(
            `/service-categories/${id}`
          )
        )
      );

      const entries = stableIds.map(
        (id, idx) => [id, results[idx].data.metadata.services ?? []] as const
      );
      return Object.fromEntries(entries) as ServicesByCategoryId;
    },
  });
};
