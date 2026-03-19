import axiosInstance from '@/lib/axios';
import type { ApiResponse } from '@/apis/api.types';

import type { ListAmenitiesResponse } from '@/types/user/amenities.api.types';

export type { ListAmenitiesRequest, ListAmenitiesResponse } from '@/types/user/amenities.api.types';

const list = async (): Promise<ListAmenitiesResponse> => {
  const response = await axiosInstance.get<ApiResponse<ListAmenitiesResponse>>(
    '/amenities'
  );
  return response.data.metadata;
};

export const userAmenitiesApi = {
  list,
};
