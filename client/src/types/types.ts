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
  icon: any;
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
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: string;
  };
  message: string;
}

export const BookingStatus = {
  CONFIRMED: 'Confirmed',
  PENDING: 'Pending Approval',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
} as const;

export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

export interface SpaceUser {
  id: string;
  name: string;
  location: string;
  rating: number;
  pricePerHour: number;
  image: string;
  amenities: string[];
  capacity: string;
}

export interface BookingUser {
  id: string;
  spaceId: string;
  spaceName: string;
  location: string;
  status: BookingStatus;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  price: number;
  paymentMethod: string;
  image: string;
}

export interface UserStats {
  totalBookings: number;
  hoursSpent: string;
  credits: number;
}
