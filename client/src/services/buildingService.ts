
import axiosInstance from '@/lib/axios';
import type {
  BuildingDetail,
  CreateBuildingPayload,
  UpdateBuildingPayload,
  BuildingQueryParams,
  GetAllBuildingsResponse,
} from '@/types/types';

type ServerRes<T> = { message: string; metadata: T };

export const buildingService = {
  getAllBuildings: async (
    params?: BuildingQueryParams
  ): Promise<GetAllBuildingsResponse> => {
    const { data } = await axiosInstance.get<
      ServerRes<GetAllBuildingsResponse>
    >('/buildings', { params });
    return data.metadata;
  },

  createBuilding: async (
    payload: CreateBuildingPayload
  ): Promise<BuildingDetail> => {
    const { data } = await axiosInstance.post<
      ServerRes<{ createBuilding: BuildingDetail }>
    >('/building', payload);
    return data.metadata.createBuilding;
  },

  getBuildingById: async (id: string): Promise<BuildingDetail> => {
    const { data } = await axiosInstance.get<
      ServerRes<{ building: BuildingDetail }>
    >(`/building/${id}`);
    return data.metadata.building;
  },

  updateBuilding: async (
    id: string,
    payload: UpdateBuildingPayload
  ): Promise<BuildingDetail> => {
    const { data } = await axiosInstance.put<
      ServerRes<{ updateBuilding: BuildingDetail }>
    >(`/building/${id}`, payload);
    return data.metadata.updateBuilding;
  },

  deleteBuilding: async (id: string): Promise<string> => {
    const { data } = await axiosInstance.delete<ServerRes<{ message: string }>>(
      `/building/${id}`
    );
    return data.message;
  },
};

export default buildingService;
