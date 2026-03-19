import axiosInstance from '@/lib/axios';
import type { ApiResponse } from '@/apis/api.types';

import type {
  CreateAmenityRequest,
  CreateAmenityResponse,
  DeleteAmenityResponse,
  ListAmenitiesResponse,
  UpdateAmenityRequest,
  UpdateAmenityResponse,
} from '@/types/admin/amenities.api.types';

export type {
  CreateAmenityRequest,
  CreateAmenityResponse,
  DeleteAmenityRequest,
  DeleteAmenityResponse,
  ListAmenitiesRequest,
  ListAmenitiesResponse,
  UpdateAmenityRequest,
  UpdateAmenityResponse,
} from '@/types/admin/amenities.api.types';

const list = async (): Promise<ListAmenitiesResponse> => {
  const response = await axiosInstance.get<ApiResponse<ListAmenitiesResponse>>(
    '/amenities'
  );
  return response.data.metadata;
};

const create = async (
  payload: CreateAmenityRequest
): Promise<CreateAmenityResponse> => {
  const response = await axiosInstance.post<
    ApiResponse<CreateAmenityResponse>
  >('/amenities', payload);
  return response.data.metadata;
};

const update = async (
  payload: UpdateAmenityRequest
): Promise<UpdateAmenityResponse> => {
  const response = await axiosInstance.put<
    ApiResponse<UpdateAmenityResponse>
  >(`/amenities/${payload.id}`, { name: payload.name });
  return response.data.metadata;
};

const remove = async (id: string): Promise<string> => {
  await axiosInstance.delete<DeleteAmenityResponse>(`/amenities/${id}`);
  return id;
};

export const adminAmenitiesApi = {
  list,
  create,
  update,
  remove,
};
