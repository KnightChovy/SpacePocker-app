import axiosInstance from '@/lib/axios';
import type { ApiResponse } from '@/apis/api.types';
import type {
  BuildingDetail,
  BuildingQueryParams,
} from '@/types/user/types';

import type {
  GetBuildingByIdResponse,
  ListBuildingsResponse,
} from '@/types/user/buildings.api.types';

export type {
  GetBuildingByIdRequest,
  GetBuildingByIdResponse,
  ListBuildingsRequest,
  ListBuildingsResponse,
} from '@/types/user/buildings.api.types';

const list = async (params?: BuildingQueryParams): Promise<ListBuildingsResponse> => {
  const response = await axiosInstance.get<ApiResponse<ListBuildingsResponse>>(
    '/buildings',
    { params }
  );
  return response.data.metadata;
};

const getById = async (id: string): Promise<BuildingDetail> => {
  const response = await axiosInstance.get<ApiResponse<GetBuildingByIdResponse>>(
    `/buildings/${id}`
  );
  return response.data.metadata.building;
};

export const userBuildingsApi = {
  list,
  getById,
};
