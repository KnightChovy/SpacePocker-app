import axiosInstance from '@/lib/axios';
import type { ApiResponse } from '@/apis/api.types';
import type {
  ApiService,
  ApiServiceCategory,
} from '@/types/user/booking-request-api';

import type {
  ListServicesByCategoryIdsResponse,
  ServicesByCategoryId,
} from '@/types/user/services.api.types';

export type {
  ListServicesByCategoryIdsRequest,
  ListServicesByCategoryIdsResponse,
  ServicesByCategoryId,
} from '@/types/user/services.api.types';

const listByCategoryIds = async (
  categoryIds: string[]
): Promise<ListServicesByCategoryIdsResponse> => {
  const ids = (categoryIds ?? []).filter(Boolean);

  const results = await Promise.all(
    ids.map(id =>
      axiosInstance.get<
        ApiResponse<ApiServiceCategory & { services: ApiService[] }>
      >(`/service-categories/${id}`)
    )
  );

  const entries = ids.map(
    (id, idx) => [id, results[idx].data.metadata.services ?? []] as const
  );

  return Object.fromEntries(entries) as ServicesByCategoryId;
};

export const userServicesApi = {
  listByCategoryIds,
};
