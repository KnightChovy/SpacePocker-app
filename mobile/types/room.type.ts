export enum RoomType {
  MEETING = 'MEETING',
  CONFERENCE = 'CONFERENCE',
  STUDIO = 'STUDIO',
  OFFICE = 'OFFICE',
  COWORKING = 'COWORKING',
  EVENT = 'EVENT',
}
export enum SortBy {
  NAME = 'name',
  PRICE = 'price',
  CAPACITY = 'capacity',
  CREATED_AT = 'createdAt',
}
export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}
export type Amenity = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};
export type Room = {
  id: string;
  name: string;
  code: string;
  roomType: RoomType;
  buildingId: string;
  buildingName?: string;
  description?: string;
  capacity: number;
  pricePerHour: number;
  isAvailable: boolean;
  amenities?: Amenity[];
  images?: string[];
  address?: string;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
};
export type GetAllRoomsParams = {
  search?: string;

  buildingId?: string;
  roomType?: RoomType;
  isAvailable?: boolean;

  minPrice?: number;
  maxPrice?: number;

  minCapacity?: number;

  sortBy?: SortBy;
  sortOrder?: SortOrder;

  limit?: number;
  offset?: number;
};

export type Pagination = {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
};

export type ActiveFilters = {
  search?: string;
  buildingId?: string | null;
  roomType?: string | null;
  status?: string | null;
  minPrice?: string;
  maxPrice?: string;
  minCapacity?: string;
  sortBy?: string;
  sortOrder?: string;
};

export type GetAllRoomsResponse = {
  message: string;
  reason: string;
  metadata: {
    rooms: Room[];
    pagination: Pagination;
    filters: ActiveFilters;
  };
};

export type RoomFilterState = {
  search: string;
  roomType: RoomType | null;
  isAvailable: boolean | null;
  priceRange: [number, number];
  minCapacity: number | null;
  sortBy: SortBy;
  sortOrder: SortOrder;
};

export const DEFAULT_FILTER_STATE: RoomFilterState = {
  search: '',
  roomType: null,
  isAvailable: null,
  priceRange: [0, 500],
  minCapacity: null,
  sortBy: SortBy.NAME,
  sortOrder: SortOrder.ASC,
};

export function countActiveFilters(filters: RoomFilterState): number {
  let count = 0;
  if (filters.roomType) count++;
  if (filters.isAvailable !== null) count++;
  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) count++;
  if (filters.minCapacity) count++;
  return count;
}
