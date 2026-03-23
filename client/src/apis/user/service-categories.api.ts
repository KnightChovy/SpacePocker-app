import axiosInstance from '@/lib/axios';
import type { ApiResponse } from '@/apis/api.types';
import type { ApiServiceCategory } from '@/types/user/booking-request-api';

import type { ListServiceCategoriesResponse } from '@/types/user/service-categories.api.types';

export type {
  ListServiceCategoriesRequest,
  ListServiceCategoriesResponse,
} from '@/types/user/service-categories.api.types';

type ApiServiceCategoryFromServer = ApiServiceCategory & {
  manager?: {
    id: string;
    name: string;
    email?: string;
  };
};

const list = async (): Promise<ListServiceCategoriesResponse> => {
  const response = await axiosInstance.get<
    ApiResponse<ApiServiceCategoryFromServer[]>
  >('/service-categories');

  // The booking UI only needs the category fields + services.
  return response.data.metadata.map(cat => ({
    id: cat.id,
    name: cat.name,
    description: cat.description ?? null,
    services: cat.services ?? [],
  }));
};

export const userServiceCategoriesApi = {
  list,
};
