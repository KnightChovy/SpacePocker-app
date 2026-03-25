import type { ApiService } from '@/types/user/booking-request-api';

export type ServicesByCategoryId = Record<string, ApiService[]>;

export type ListServicesByCategoryIdsRequest = { categoryIds: string[] };
export type ListServicesByCategoryIdsResponse = ServicesByCategoryId;
