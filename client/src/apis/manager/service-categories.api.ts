import axiosInstance from '@/lib/axios';
import type { ApiResponse } from '@/apis/api.types';

import type {
  CreateServiceCategoryRequest,
  CreateServiceCategoryResponse,
  DeleteServiceCategoryResponse,
  ListServiceCategoriesResponse,
  UpdateServiceCategoryRequest,
  UpdateServiceCategoryResponse,
} from '@/types/manager/service-categories.api.types';

export type {
  CreateServiceCategoryPayload,
  CreateServiceCategoryRequest,
  CreateServiceCategoryResponse,
  DeleteServiceCategoryRequest,
  DeleteServiceCategoryResponse,
  ListServiceCategoriesRequest,
  ListServiceCategoriesResponse,
  UpdateServiceCategoryPayload,
  UpdateServiceCategoryRequest,
  UpdateServiceCategoryResponse,
} from '@/types/manager/service-categories.api.types';

const list = async (): Promise<ListServiceCategoriesResponse> => {
  const response = await axiosInstance.get<
    ApiResponse<ListServiceCategoriesResponse>
  >('/service-categories');
  return response.data.metadata;
};

const create = async (
  payload: CreateServiceCategoryRequest
): Promise<CreateServiceCategoryResponse> => {
  const response = await axiosInstance.post<
    ApiResponse<CreateServiceCategoryResponse>
  >('/service-categories', payload);
  return response.data.metadata;
};

const update = async (
  payload: UpdateServiceCategoryRequest
): Promise<UpdateServiceCategoryResponse> => {
  const response = await axiosInstance.put<
    ApiResponse<UpdateServiceCategoryResponse>
  >(`/service-categories/${payload.id}`, {
    name: payload.name,
    description: payload.description,
  });
  return response.data.metadata;
};

const remove = async (id: string): Promise<string> => {
  await axiosInstance.delete<DeleteServiceCategoryResponse>(
    `/service-categories/${id}`
  );
  return id;
};

export const managerServiceCategoriesApi = {
  list,
  create,
  update,
  remove,
};
