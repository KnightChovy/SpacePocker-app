import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { userServicesApi } from '@/apis/user/services.api';

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
      return userServicesApi.listByCategoryIds(stableIds);
    },
  });
};
