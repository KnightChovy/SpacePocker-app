import type {
  Space,
  SpaceType,
  Amenity,
  BookingData,
  BookingResponse,
} from '@/types/types';
import { SPACES, SPACE_DETAILS_MAP } from '@/data/constant';

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

    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return SPACES;
  },

  // Lấy spaces với filter
  getFilteredSpaces: async (params?: SpaceFilterParams): Promise<Space[]> => {
    // TODO: Fetch API - GET /api/spaces?minPrice=...&maxPrice=...
    // const response = await axiosInstance.get<SpacesResponse>('/spaces', { params });
    // return response.data.data;

    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    let filteredSpaces = [...SPACES];

    if (params) {
      if (params.minPrice !== undefined) {
        filteredSpaces = filteredSpaces.filter(
          (s) => s.price >= params.minPrice!,
        );
      }
      if (params.maxPrice !== undefined) {
        filteredSpaces = filteredSpaces.filter(
          (s) => s.price <= params.maxPrice!,
        );
      }
      if (params.spaceTypes && params.spaceTypes.length > 0) {
        filteredSpaces = filteredSpaces.filter(
          (s) => s.type && params.spaceTypes!.includes(s.type),
        );
      }
      if (params.amenities && params.amenities.length > 0) {
        filteredSpaces = filteredSpaces.filter((s) =>
          params.amenities!.every((a) => s.amenities?.includes(a)),
        );
      }
      if (params.minRating !== undefined) {
        filteredSpaces = filteredSpaces.filter(
          (s) => s.rating >= params.minRating!,
        );
      }
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        filteredSpaces = filteredSpaces.filter(
          (s) =>
            s.name.toLowerCase().includes(searchLower) ||
            s.title?.toLowerCase().includes(searchLower) ||
            s.description.toLowerCase().includes(searchLower) ||
            s.location?.toLowerCase().includes(searchLower),
        );
      }
    }

    return filteredSpaces;
  },

  // Lấy chi tiết space theo ID
  getSpaceById: async (id: string): Promise<Space> => {
    // TODO: Fetch API - GET /api/spaces/:id
    // const response = await axiosInstance.get<SpaceResponse>(`/spaces/${id}`);
    // return response.data.data;

    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const space = SPACES.find((s) => s.id === id);
    if (!space) {
      throw new Error(`Space with id ${id} not found`);
    }
    return space;
  },
};

/**
 * Fetch space detail với đầy đủ thông tin cho detail page
 * TODO: Thay thế bằng API call thật khi backend sẵn sàng
 * Backend API endpoint: GET /api/spaces/:id/detail
 * Response format: { data: Space }
 */
export const fetchSpaceDetail = async (id: string): Promise<Space> => {
  // TODO: Uncomment khi có API thật
  // const response = await axiosInstance.get<{ data: Space }>(`/spaces/${id}/detail`);
  // return response.data.data;

  // Mock API delay để giống thật
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Trả về space từ SPACES array theo id
  const space = SPACES.find((s) => s.id === id);
  if (!space) {
    throw new Error(`Space with id ${id} not found`);
  }

  // Merge với detail data nếu có
  const detailData = SPACE_DETAILS_MAP[id];
  if (detailData) {
    return {
      ...space,
      amenities: detailData.amenitiesDetail,
    };
  }

  return space;
};

/**
 * Tạo booking mới
 * TODO: Thay thế bằng API call thật khi backend sẵn sàng
 * Backend API endpoint: POST /api/bookings
 * Request body: BookingData
 * Response format: BookingResponse
 */
export const createBooking = async (
  bookingData: BookingData,
): Promise<BookingResponse> => {
  // TODO: Uncomment khi có API thật
  // const response = await axiosInstance.post<BookingResponse>('/bookings', bookingData);
  // return response.data;

  // Mock API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock response
  console.log('📝 Booking Data to BE:', bookingData);

  return {
    data: {
      id: Math.random().toString(36).substr(2, 9),
      bookingId: `BK-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
    message: 'Booking created successfully',
  };
};
