import { Building } from './building.type';

export enum RoomType {
  MEETING = 'MEETING',
  CLASSROOM = 'CLASSROOM',
  EVENT = 'EVENT',
  OTHER = 'OTHER',
}

export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  MAINTENANCE = 'MAINTENANCE',
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

export type RoomAmenity = {
  roomId: string;
  amenityId: string;
  createdAt: string;
  amenity: Amenity;
};

export type ServiceItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
};

export type ServiceCategory = {
  id: string;
  managerId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  services: ServiceItem[];
};

export type RoomServiceCategory = {
  roomId: string;
  categoryId: string;
  createdAt: string;
  category: ServiceCategory;
};

export type Manager = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export type Room = {
  id: string;
  buildingId: string;
  managerId: string;
  name: string;
  roomCode: string;
  roomType: RoomType;
  description?: string;
  capacity: number;
  pricePerHour: number;
  securityDeposit: number;
  area: number | null;
  status: RoomStatus;
  images: string[];
  building: Building;
  manager: Manager;
  amenities: RoomAmenity[];
  serviceCategories: RoomServiceCategory[];
  createdAt: string;
  updatedAt: string;
};
export type GetAllRoomsParams = {
  search?: string;
  buildingId?: string;
  roomType?: RoomType;
  status?: RoomStatus;
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
  status: RoomStatus | null;
  priceRange: [number, number];
  minCapacity: number | null;
  sortBy: SortBy;
  sortOrder: SortOrder;
};

export const DEFAULT_FILTER_STATE: RoomFilterState = {
  search: '',
  roomType: null,
  status: null,
  priceRange: [0, 500],
  minCapacity: null,
  sortBy: SortBy.NAME,
  sortOrder: SortOrder.ASC,
};

export function countActiveFilters(filters: RoomFilterState): number {
  let count = 0;
  if (filters.roomType) count++;
  if (filters.status !== null) count++;
  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) count++;
  if (filters.minCapacity) count++;
  return count;
}

// ─── Room Detail ──────────────────────────────────────────────────────────────

export type RoomDetail = {
  id: string;
  buildingId: string;
  managerId: string;
  name: string;
  description?: string;
  pricePerHour: number;
  securityDeposit: number;
  capacity: number;
  roomType: RoomType;
  area: number | null;
  status: RoomStatus;
  roomCode: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  building: Building;
  manager: Manager;
  amenities: RoomAmenity[];
  serviceCategories: RoomServiceCategory[];
};

export type GetRoomByIdResponse = {
  message: string;
  metadata: {
    room: RoomDetail;
  };
};
