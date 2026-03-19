import type { ApiServiceCategory } from '@/types/user/booking-request-api';

export interface CreateServiceCategoryPayload {
  name: string;
  description?: string;
  managerId: string;
}

export interface UpdateServiceCategoryPayload {
  id: string;
  name: string;
  description?: string;
}

export type ListServiceCategoriesRequest = void;
export type ListServiceCategoriesResponse = ApiServiceCategory[];

export type CreateServiceCategoryRequest = CreateServiceCategoryPayload;
export type CreateServiceCategoryResponse = ApiServiceCategory;

export type UpdateServiceCategoryRequest = UpdateServiceCategoryPayload;
export type UpdateServiceCategoryResponse = ApiServiceCategory;

export type DeleteServiceCategoryRequest = { id: string };
export type DeleteServiceCategoryResponse = void;
