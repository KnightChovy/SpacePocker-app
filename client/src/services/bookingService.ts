import type { BookingStatus } from '@/types/user/types';

export type UpdateBookingPayload = {
  id: string;
  customerName: string;
  customerDepartment?: string;
  roomId: string;
  roomName: string;
  roomBuilding: string;
  scheduleDate: string;
  startTime: string;
  endTime: string;
  amount: number;
  status: BookingStatus;
};

export const bookingService = {
  updateBooking: async (_payload: UpdateBookingPayload): Promise<void> => {
    // This project currently doesn't ship a manager booking API client.
    // Keep the UI functional and avoid build-time missing-module errors.
    return;
  },
};
