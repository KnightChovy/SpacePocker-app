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
    await new Promise(resolve => setTimeout(resolve, 300));
    return SPACES;
  },

  getFilteredSpaces: async (params?: SpaceFilterParams): Promise<Space[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    let filteredSpaces = [...SPACES];

    if (params) {
      if (params.minPrice !== undefined) {
        filteredSpaces = filteredSpaces.filter(
          s => s.price >= params.minPrice!
        );
      }
      if (params.maxPrice !== undefined) {
        filteredSpaces = filteredSpaces.filter(
          s => s.price <= params.maxPrice!
        );
      }
      if (params.spaceTypes && params.spaceTypes.length > 0) {
        filteredSpaces = filteredSpaces.filter(
          s => s.type && params.spaceTypes!.includes(s.type)
        );
      }
      if (params.amenities && params.amenities.length > 0) {
        filteredSpaces = filteredSpaces.filter(s =>
          params.amenities!.every(a =>
            s.amenities?.some(amenity =>
              typeof amenity === 'string' ? amenity === a : amenity.label === a
            )
          )
        );
      }
      if (params.minRating !== undefined) {
        filteredSpaces = filteredSpaces.filter(
          s => s.rating >= params.minRating!
        );
      }
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        filteredSpaces = filteredSpaces.filter(
          s =>
            s.name.toLowerCase().includes(searchLower) ||
            s.title?.toLowerCase().includes(searchLower) ||
            s.description.toLowerCase().includes(searchLower) ||
            s.location?.toLowerCase().includes(searchLower)
        );
      }
    }

    return filteredSpaces;
  },

  getSpaceById: async (id: string): Promise<Space> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const space = SPACES.find(s => s.id === id);
    if (!space) {
      throw new Error(`Space with id ${id} not found`);
    }
    return space;
  },
};

export const fetchSpaceDetail = async (id: string): Promise<Space> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const space = SPACES.find(s => s.id === id);
  if (!space) {
    throw new Error(`Space with id ${id} not found`);
  }

  const detailData = SPACE_DETAILS_MAP[id];
  if (detailData) {
    return {
      ...space,
      amenities: detailData.amenitiesDetail,
    };
  }

  return space;
};

export const createBooking = async (
  bookingData: BookingData
): Promise<BookingResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));

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
