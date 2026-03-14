import type React from 'react';

export type SpaceType =
  | 'Meeting Room'
  | 'Conference Hall'
  | 'Private Office'
  | 'Co-working Space'
  | 'Event Space';

export type Amenity =
  | 'WiFi'
  | 'Projector'
  | 'Whiteboard'
  | 'Air Conditioning'
  | 'Coffee Machine'
  | 'Parking'
  | 'Kitchen Access'
  | 'Reception Service';

export type Badge = 'Verified' | 'New';

export interface Space {
  id: string;
  name: string;
  title?: string;
  description: string;
  price: number;
  rating: number;
  capacity: number;
  imageUrl: string;
  badge?: Badge;
  isInstantBook?: boolean;
  type?: SpaceType;
  amenities?: Amenity[] | AmenityDetail[];
  location?: string;
  locationDescription?: string;
  label?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  reviewCount?: number;
  host?: Host;
  images?: string[];
  reviews?: Review[];
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface FilterState {
  priceRange: [number, number];
  spaceTypes: SpaceType[];
  amenities: Amenity[];
  minRating: number | null;
  searchQuery: string;
}

// Types cho Detail Page
export interface Host {
  name: string;
  joinedDate: string;
  avatar: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  date: string;
  content: string;
  rating: number;
}

export interface AmenityDetail {
  icon: string;
  label: string;
}

export interface BookingData {
  spaceId: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  totalPrice: number;
  guests: number;
}

export interface BookingResponse {
  data: {
    id: string;
    bookingId: string;
    status: Exclude<BookingStatus, 'completed'>;
    createdAt: string;
  };
  message: string;
}

// ==========================================
// MANAGER TYPES - Shared Types
// ==========================================

// Status Types
export type RoomStatus = 'available' | 'occupied' | 'maintenance' | 'booked';
export type BookingStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';
export type BookingType = 'primary' | 'teal' | 'amber' | 'maintenance';
export type ActivityType =
  | 'booking'
  | 'maintenance'
  | 'inquiry'
  | 'cancellation';
export type StatType = 'revenue' | 'bookings' | 'occupancy' | 'inquiries';

// Status Label Maps
export const RoomStatusLabel: Record<RoomStatus, string> = {
  available: 'Available',
  occupied: 'Occupied',
  maintenance: 'Maintenance',
  booked: 'Booked',
};

export const BookingStatusLabel: Record<BookingStatus, string> = {
  confirmed: 'Confirmed',
  pending: 'Pending',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

// ==========================================
// ROOM TYPES - Unified Room Interface
// ==========================================

// Base Room - core fields shared by all room types
export interface BaseRoom {
  id: string;
  name: string;
  type: string;
  capacity: number;
}

// Room - full room for management (extends BaseRoom)
export interface Room extends BaseRoom {
  building: string;
  status: RoomStatus;
  pricePerHour: number;
  imageUrl: string;
  amenities?: string[];
  description?: string;
  category?: string;
  location?: string;
}

// Aliases for backward compatibility
export type ScheduleRoom = BaseRoom;
export type ManagerRoom = Room;

// ==========================================
// BOOKING TYPES - Unified Booking Interface
// ==========================================
export interface Customer {
  id: string;
  name: string;
  avatar?: string;
  initials?: string;
  department?: string;
}
export interface ScheduleBooking {
  id: string;
  roomId: string;
  title: string;
  subtitle?: string;
  startTime: string;
  endTime: string;
  type: BookingType;
  icon?: string;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  customer: Customer;
  room: BookingRoom;
  scheduleDate: string;
  startTime: string;
  endTime: string;
  amount: number;
  status: BookingStatus;
}

// ==========================================
// BUILDING & NAVIGATION
// ==========================================

export interface Building {
  id: string;
  name: string;
  count: number;
  checked?: boolean;
}

// Manager entity for building management
export interface ManagerEntity {
  id: string;
  name: string;
  email: string;
}

// Full Building entity (matches server model)
export interface BuildingDetail {
  id: string;
  buildingName: string;
  address: string;
  campus: string;
  managerId: string;
  latitude?: number;
  longitude?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBuildingPayload {
  buildingName: string;
  address: string;
  campus: string;
  managerId?: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateBuildingPayload {
  buildingName?: string;
  address?: string;
  campus?: string;
  managerId?: string;
  latitude?: number;
  longitude?: number;
}

export interface BuildingQueryParams {
  search?: string;
  campus?: string;
  sortBy?: 'buildingName' | 'campus' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface BuildingPagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface GetAllBuildingsResponse {
  buildings: BuildingDetail[];
  pagination: BuildingPagination;
  filters: {
    search: string | null;
    campus: string | null;
    sortBy: string | null;
    sortOrder: string | null;
  };
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  active?: boolean;
}

// ==========================================
// DASHBOARD TYPES
// ==========================================

export interface StatItem {
  label: string;
  value: string | number;
  trend?: number;
  subtext?: string;
  type: StatType;
}

export interface Activity {
  id: string;
  user: Pick<User, 'name' | 'avatar'>;
  action: string;
  target: string;
  timestamp: string;
  detail?: string;
  type: ActivityType;
}

export interface ChartDataItem {
  name: string;
  value: number;
}

export interface BookingDistribution {
  roomType: string;
  booked: number;
  available: number;
}

// USER TYPES
export interface User {
  id: string;
  name: string;
  email?: string;
  role: string;
  avatar?: string;
  avatarUrl?: string;
}

export type Manager = Pick<User, 'name' | 'role' | 'avatar'>;
export type BookingRoom = Pick<Room, 'id' | 'name' | 'building'>;

export interface StatSummary {
  label: string;
  value: string | number;
  change: number;
  icon: string;
  trend: 'up' | 'down' | 'flat';
  color: string;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  target: number;
}

export interface RoomPerformance {
  id: string;
  name: string;
  location: string;
  revenue: number;
  occupancy: number;
  imageUrl: string;
}

export interface UsageHeatmapData {
  time: string;
  mon: number;
  tue: number;
  wed: number;
  thu: number;
  fri: number;
  sat: number;
  sun: number;
}

export type TimeRange = '30days' | 'quarter' | 'year';
