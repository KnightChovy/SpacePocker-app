import axiosInstance from '@/lib/axios';
import type { Space, SpaceType, Amenity } from '@/types/types';

export interface SpaceFilterParams {
  minPrice?: number;
  maxPrice?: number;
  spaceTypes?: SpaceType[];
  amenities?: Amenity[];
  minRating?: number;
  search?: string;
}

export interface SpacesResponse {
  data: Space[];
  total: number;
}

export interface SpaceResponse {
  data: Space;
}

export const spaceService = {
  getAllSpaces: async (): Promise<Space[]> => {
    // TODO: Fetch API - GET /api/spaces
    // const response = await axiosInstance.get<SpacesResponse>('/spaces');
    // return response.data.data;

    return []; // Mock data tạm thời
  },

  // Lấy spaces với filter
  getFilteredSpaces: async (params?: SpaceFilterParams): Promise<Space[]> => {
    // TODO: Fetch API - GET /api/spaces?minPrice=...&maxPrice=...
    // const response = await axiosInstance.get<SpacesResponse>('/spaces', { params });
    // return response.data.data;

    return []; // Mock data tạm thời
  },

  // Lấy chi tiết space theo ID
  getSpaceById: async (id: string): Promise<Space> => {
    // TODO: Fetch API - GET /api/spaces/:id
    // const response = await axiosInstance.get<SpaceResponse>(`/spaces/${id}`);
    // return response.data.data;

    throw new Error(`Space ${id} not found - API chưa implement`);
  },
};
