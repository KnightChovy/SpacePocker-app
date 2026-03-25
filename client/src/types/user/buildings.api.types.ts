import type {
  BuildingDetail,
  BuildingQueryParams,
  GetAllBuildingsResponse,
} from '@/types/user/types';

export type ListBuildingsRequest = { params?: BuildingQueryParams };
export type ListBuildingsResponse = GetAllBuildingsResponse;

export type GetBuildingByIdRequest = { id: string };
export type GetBuildingByIdResponse = { building: BuildingDetail };
