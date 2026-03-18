export enum BookingStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export type CreateBookingRequest = {
  roomId: string;
  startTime: string;
  endTime: string;
  purpose: string;
  amenityIds: string[];
  services: {
    serviceId: string;
    quantity: number;
  }[];
};

export type BookingRoom = {
  id: string;
  name: string;
  roomCode: string;
};

export type BookingUser = {
  id: string;
  name: string;
  email: string;
};

export type BookingAmenity = {
  id: string;
  name: string;
};

export type BookingServiceItem = {
  serviceId: string;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
};

export type Booking = {
  id: string;
  userId: string;
  roomId: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: BookingStatus;
  room: BookingRoom;
  user: BookingUser;
  amenities: BookingAmenity[];
  services: BookingServiceItem[];
  totalCost: number;
};

export type CreateBookingResponse = Booking & { paymentUrl?: string };

export type BookingFilterState = {
  status: BookingStatus | null;
  startDate: string | null;
  endDate: string | null;
};
