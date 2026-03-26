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

export type BookingRequestStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'CHECKED_IN';

export interface BookingRequestUserLite {
  id: string;
  name: string;
  email: string;
}

export interface BookingRequestRoomLite {
  id: string;
  name: string;
  roomCode?: string | null;
}

export interface BookingRequestForManager {
  id: string;
  userId: string;
  roomId: string;
  startTime: string;
  endTime: string;
  purpose?: string | null;
  status: BookingRequestStatus;
  approvedBy?: string | null;
  createdAt: string;
  user: BookingRequestUserLite;
  room: BookingRequestRoomLite;
  checkInRecord?: {
    id: string;
    checkedInAt: string;
    checkedOutAt?: string | null;
  } | null;
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

export interface ApproveBookingRequestResult {
  bookingRequest: {
    id: string;
    status: BookingRequestStatus;
  } | null;
  booking: {
    id: string;
    status: BookingRequestStatus;
  };
}

export interface MyBookingRequestBuildingLite {
  id: string;
  buildingName?: string;
  campus?: string;
  address?: string;
}

export interface MyBookingRequestRoomLite {
  id: string;
  name: string;
  roomCode?: string | null;
  pricePerHour?: number;
  images?: string[];
  building?: MyBookingRequestBuildingLite | null;
}

export interface MyBookingRequest {
  id: string;
  userId: string;
  roomId: string;
  startTime: string;
  endTime: string;
  purpose?: string | null;
  reason?: string | null;
  cancelReason?: string | null;
  rejectionReason?: string | null;
  refund?: {
    reason?: string | null;
  } | null;
  status: BookingRequestStatus;
  createdAt: string;
  room: MyBookingRequestRoomLite;
  checkInRecord?: {
    id: string;
    checkedInAt: string;
    checkedOutAt?: string | null;
  } | null;
}
