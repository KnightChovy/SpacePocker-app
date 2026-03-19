import type {
  BuildingDetail,
  BuildingQueryParams,
  CreateBuildingPayload,
  GetAllBuildingsResponse,
  UpdateBuildingPayload,
} from '@/types/user/types';

export type ListBuildingsRequest = { params?: BuildingQueryParams };
export type ListBuildingsResponse = GetAllBuildingsResponse;

export type GetBuildingByIdRequest = { id: string };
export type GetBuildingByIdResponse = { building: BuildingDetail };

export type CreateBuildingRequest = CreateBuildingPayload;
export type CreateBuildingResponse = { createBuilding: BuildingDetail };

export type UpdateBuildingRequest = {
  id: string;
  payload: UpdateBuildingPayload;
};
export type UpdateBuildingResponse = { updateBuilding: BuildingDetail };

export type DeleteBuildingRequest = { id: string };
export type DeleteBuildingResponse = { message: string };
