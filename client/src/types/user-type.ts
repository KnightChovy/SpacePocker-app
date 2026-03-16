export const BookingStatus = {
  CONFIRMED: 'Confirmed',
  AWAITING_PAYMENT: 'Awaiting Payment',
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
