import axiosInstance from '@/lib/axios';
import type { ApiResponse } from '@/apis/api.types';

import type {
  CreateServiceRequest,
  CreateServiceResponse,
  DeleteServiceResponse,
  ListServicesResponse,
  UpdateServiceRequest,
  UpdateServiceResponse,
} from '@/types/admin/services.api.types';

export type {
  CreateServicePayload,
  CreateServiceRequest,
  CreateServiceResponse,
  DeleteServiceRequest,
  DeleteServiceResponse,
  ListServicesRequest,
  ListServicesResponse,
  UpdateServicePayload,
  UpdateServiceRequest,
  UpdateServiceResponse,
} from '@/types/admin/services.api.types';

const list = async (): Promise<ListServicesResponse> => {
  const response =
    await axiosInstance.get<ApiResponse<ListServicesResponse>>('/services');
  return response.data.metadata;
};

const create = async (
  payload: CreateServiceRequest
): Promise<CreateServiceResponse> => {
  const response = await axiosInstance.post<ApiResponse<CreateServiceResponse>>(
    '/services',
    payload
  );
  return response.data.metadata;
};

const update = async (
  payload: UpdateServiceRequest
): Promise<UpdateServiceResponse> => {
  const response = await axiosInstance.put<ApiResponse<UpdateServiceResponse>>(
    `/services/${payload.id}`,
    {
      name: payload.name,
      description: payload.description,
      price: payload.price,
      categoryId: payload.categoryId,
    }
  );
  return response.data.metadata;
};

const remove = async (id: string): Promise<string> => {
  await axiosInstance.delete<DeleteServiceResponse>(`/services/${id}`);
  return id;
};

export const adminServicesApi = {
  list,
  create,
  update,
  remove,
};
