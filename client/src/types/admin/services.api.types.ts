import type { ApiService } from '@/types/user/booking-request-api';

export interface CreateServicePayload {
  name: string;
  description?: string;
  price: number;
  categoryId: string;
}

export interface UpdateServicePayload {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
}

export type ListServicesRequest = void;
export type ListServicesResponse = ApiService[];

export type CreateServiceRequest = CreateServicePayload;
export type CreateServiceResponse = ApiService;

export type UpdateServiceRequest = UpdateServicePayload;
export type UpdateServiceResponse = ApiService;

export type DeleteServiceRequest = { id: string };
export type DeleteServiceResponse = void;
