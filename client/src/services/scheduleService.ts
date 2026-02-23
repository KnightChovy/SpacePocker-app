import type { ScheduleRoom, ScheduleBooking, Building } from '@/types/types';
import { BUILDINGS, ROOMS, BOOKINGS } from '@/data/constantManager';

export interface BuildingsResponse {
  data: Building[];
}

export interface ScheduleRoomsResponse {
  data: ScheduleRoom[];
}

export interface BookingsResponse {
  data: ScheduleBooking[];
}

export interface BookingResponse {
  data: ScheduleBooking;
}

// Filter params
export interface ScheduleFilterParams {
  date?: Date;
  buildingIds?: string[];
  amenities?: string[];
  roomType?: string;
}

export interface CreateBookingData {
  roomId: string;
  title: string;
  subtitle?: string;
  startTime: string;
  endTime: string;
  type: 'primary' | 'teal' | 'amber' | 'maintenance';
  icon?: string;
}

export interface UpdateBookingData extends Partial<CreateBookingData> {
  id: string;
}

export const scheduleService = {

  getBuildings: async (): Promise<Building[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    return BUILDINGS;
  },

  getRooms: async (params?: ScheduleFilterParams): Promise<ScheduleRoom[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    let filteredRooms = [...ROOMS];

    if (params?.roomType) {
      filteredRooms = filteredRooms.filter(
        room => room.type.toLowerCase() === params.roomType?.toLowerCase()
      );
    }

    return filteredRooms;
  },

  getBookings: async (
    params?: ScheduleFilterParams
  ): Promise<ScheduleBooking[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));


    let filteredBookings = [...BOOKINGS];

    if (params?.buildingIds && params.buildingIds.length > 0) {
      filteredBookings = filteredBookings.filter(booking => {
        return ROOMS.some(room => room.id === booking.roomId);
      });
    }

    return filteredBookings;
  },

  getBookingById: async (id: string): Promise<ScheduleBooking | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 200));

    return BOOKINGS.find(booking => booking.id === id);
  },

  createBooking: async (data: CreateBookingData): Promise<ScheduleBooking> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const newBooking: ScheduleBooking = {
      ...data,
      id: `b${Date.now()}`,
      subtitle: data.subtitle || '',
    };

    console.log('Created booking:', newBooking);
    return newBooking;
  },

  updateBooking: async (data: UpdateBookingData): Promise<ScheduleBooking> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const existingBooking = BOOKINGS.find(b => b.id === data.id);
    if (!existingBooking) {
      throw new Error(`Booking with id ${data.id} not found`);
    }

    const updatedBooking: ScheduleBooking = {
      ...existingBooking,
      ...data,
    };

    console.log('Updated booking:', updatedBooking);
    return updatedBooking;
  },

  deleteBooking: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('Deleted booking:', id);
  },

  checkAvailability: async (
    roomId: string,
    _date: Date,
    startTime: string,
    endTime: string
  ): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const roomBookings = BOOKINGS.filter(b => b.roomId === roomId);
    const hasConflict = roomBookings.some(booking => {
      const bookingStart = booking.startTime;
      const bookingEnd = booking.endTime;
      return !(endTime <= bookingStart || startTime >= bookingEnd);
    });

    return !hasConflict;
  },
};

export default scheduleService;
