import axiosInstance from '@/lib/axios';
import type { ApiResponse } from '@/apis/api.types';
import type {
  BuildingDetail,
  BuildingQueryParams,
  UpdateBuildingPayload,
} from '@/types/user/types';

import type {
  CreateBuildingRequest,
  CreateBuildingResponse,
  DeleteBuildingResponse,
  GetBuildingByIdResponse,
  ListBuildingsResponse,
  UpdateBuildingResponse,
} from '@/types/manager/buildings.api.types';

export type {
  CreateBuildingRequest,
  CreateBuildingResponse,
  DeleteBuildingRequest,
  DeleteBuildingResponse,
  GetBuildingByIdRequest,
  GetBuildingByIdResponse,
  ListBuildingsRequest,
  ListBuildingsResponse,
  UpdateBuildingRequest,
  UpdateBuildingResponse,
} from '@/types/manager/buildings.api.types';

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

const create = async (payload: CreateBuildingRequest): Promise<BuildingDetail> => {
  const response = await axiosInstance.post<ApiResponse<CreateBuildingResponse>>(
    '/buildings',
    payload
  );
  return response.data.metadata.createBuilding;
};

const update = async (id: string, payload: UpdateBuildingPayload): Promise<BuildingDetail> => {
  const response = await axiosInstance.patch<ApiResponse<UpdateBuildingResponse>>(
    `/buildings/${id}`,
    payload
  );
  return response.data.metadata.updateBuilding;
};

const remove = async (id: string): Promise<DeleteBuildingResponse> => {
  const response = await axiosInstance.delete<ApiResponse<DeleteBuildingResponse>>(
    `/buildings/${id}`
  );
  return response.data.metadata;
};

export const managerBuildingsApi = {
  list,
  getById,
  create,
  update,
  remove,
};
