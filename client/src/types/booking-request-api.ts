import type { ApiAmenity } from './room-api';

export interface ApiService {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  categoryId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiServiceCategory {
  id: string;
  name: string;
  description?: string | null;
  services: ApiService[];
}

export interface RoomAmenitiesServicesResponse {
  amenities: ApiAmenity[];
  serviceCategories: ApiServiceCategory[];
}

export interface CreateBookingRequestPayload {
  roomId: string;
  startTime: string;
  endTime: string;
  purpose?: string;
  amenityIds?: string[];
  services?: Array<{ serviceId: string; quantity: number }>;
}

export interface BookingRequestAmenity {
  id: string;
  name: string;
}

export interface BookingRequestServiceLine {
  serviceId: string;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

export interface CreateBookingRequestResult {
  id: string;
  userId: string;
  roomId: string;
  startTime: string;
  endTime: string;
  purpose?: string | null;
  status: string;
  createdAt: string;
  amenities: BookingRequestAmenity[];
  services: BookingRequestServiceLine[];
  totalCost: number;
}
