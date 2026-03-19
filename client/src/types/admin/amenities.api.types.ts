import type { ApiAmenity } from '@/types/user/room-api';

export type ListAmenitiesRequest = void;
export type ListAmenitiesResponse = ApiAmenity[];

export type CreateAmenityRequest = { name: string };
export type CreateAmenityResponse = ApiAmenity;

export type UpdateAmenityRequest = { id: string; name: string };
export type UpdateAmenityResponse = ApiAmenity;

export type DeleteAmenityRequest = { id: string };
export type DeleteAmenityResponse = void;
