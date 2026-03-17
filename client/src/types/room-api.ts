export type ApiRoomType = 'MEETING' | 'CLASSROOM' | 'EVENT' | 'OTHER';

export type ApiRoomStatus =
  | 'AVAILABLE'
  | 'UNAVAILABLE'
  | 'PROCESS'
  | 'MAINTAIN';

export interface ApiAmenity {
  id: string;
  name: string;
}

export interface ApiRoomAmenity {
  amenity: ApiAmenity;
}

export interface ApiRoomServiceCategory {
  category: {
    id: string;
    name: string;
    description?: string | null;
  };
}

export interface ApiBuilding {
  id: string;
  buildingName: string;
  address?: string;
  campus?: string;
  managerId?: string;
  latitude?: number;
  longitude?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiManager {
  id: string;
  name: string;
  email?: string;
}

export interface ApiRoom {
  id: string;
  buildingId: string;
  managerId: string;
  name: string;
  description?: string | null;
  pricePerHour: number;
  securityDeposit?: number | null;
  capacity: number;
  roomType: ApiRoomType;
  area?: number | null;
  status: ApiRoomStatus;
  roomCode: string;
  images: string[];
  building?: ApiBuilding;
  manager?: ApiManager;
  amenities?: ApiRoomAmenity[];
  serviceCategories?: ApiRoomServiceCategory[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RoomQueryParams {
  search?: string;
  buildingId?: string;
  roomType?: ApiRoomType;
  status?: ApiRoomStatus;
  minPrice?: number;
  maxPrice?: number;
  minCapacity?: number;
  sortBy?: 'name' | 'pricePerHour' | 'capacity' | 'roomType' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface RoomPagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface GetAllRoomsResponse {
  rooms: ApiRoom[];
  pagination: RoomPagination;
  filters: {
    search: string | null;
    buildingId: string | null;
    roomType: string | null;
    status: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    minCapacity: number | null;
    sortBy: string | null;
    sortOrder: string | null;
  };
}

export interface CreateRoomPayload {
  buildingId: string;
  managerId?: string;
  name: string;
  description?: string;
  pricePerHour: number;
  securityDeposit?: number;
  capacity: number;
  roomType: ApiRoomType;
  area?: number;
  roomCode: string;
  status?: ApiRoomStatus;
  images?: string[];
  amenities?: string[];
  serviceCategories?: string[];
}

export interface UpdateRoomPayload {
  name?: string;
  description?: string;
  pricePerHour?: number;
  securityDeposit?: number;
  capacity?: number;
  roomType?: ApiRoomType;
  area?: number;
  status?: ApiRoomStatus;
  images?: string[];
  amenities?: string[];
  serviceCategories?: string[];
}
