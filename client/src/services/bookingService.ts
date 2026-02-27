import type { Booking, BookingStatus } from '@/types/types';
import { MOCK_BOOKINGS } from '@/data/constantManager';
// import axiosInstance from '@/lib/axios';

// Store for mock data manipulation
const bookingsStore = [...MOCK_BOOKINGS];

// Response types
export interface BookingsResponse {
  data: Booking[];
  total: number;
}

export interface BookingDetailResponse {
  data: Booking;
}

// Filter params
export interface BookingFilterParams {
  search?: string;
  status?: BookingStatus;
  building?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

// Create/Update data
export interface CreateBookingData {
  customerId: string;
  customerName: string;
  customerDepartment?: string;
  roomId: string;
  roomName: string;
  roomBuilding: string;
  scheduleDate: string;
  startTime: string;
  endTime: string;
  amount: number;
}

export interface UpdateBookingData extends Partial<CreateBookingData> {
  id: string;
  status?: BookingStatus;
}

export const bookingService = {
  // TODO: Replace mock data with actual API calls
  // Example: return axiosInstance.get('/api/manager/bookings', { params }).then(res => res.data);

  getAllBookings: async (params?: BookingFilterParams): Promise<Booking[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    let filteredBookings = [...bookingsStore];

    if (params) {
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        filteredBookings = filteredBookings.filter(
          booking =>
            booking.customer.name.toLowerCase().includes(searchLower) ||
            booking.room.name.toLowerCase().includes(searchLower) ||
            booking.bookingNumber.toLowerCase().includes(searchLower)
        );
      }

      if (params.status) {
        filteredBookings = filteredBookings.filter(
          booking => booking.status === params.status
        );
      }

      if (params.building) {
        filteredBookings = filteredBookings.filter(
          booking => booking.room.building === params.building
        );
      }
    }

    return filteredBookings;
  },

  getBookingById: async (id: string): Promise<Booking | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    // TODO: return axiosInstance.get(`/api/manager/bookings/${id}`).then(res => res.data);

    return bookingsStore.find(booking => booking.id === id);
  },

  createBooking: async (data: CreateBookingData): Promise<Booking> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // TODO: return axiosInstance.post('/api/manager/bookings', data).then(res => res.data);

    const newBooking: Booking = {
      id: Date.now().toString(),
      bookingNumber: `#BK-${Math.floor(Math.random() * 10000)}`,
      customer: {
        id: data.customerId,
        name: data.customerName,
        initials: data.customerName
          .split(' ')
          .map(n => n[0])
          .join(''),
        department: data.customerDepartment,
      },
      room: {
        id: data.roomId,
        name: data.roomName,
        building: data.roomBuilding,
      },
      scheduleDate: data.scheduleDate,
      startTime: data.startTime,
      endTime: data.endTime,
      amount: data.amount,
      status: 'pending',
    };

    bookingsStore.push(newBooking);
    console.log('Created booking:', newBooking);
    return newBooking;
  },

  updateBooking: async (data: UpdateBookingData): Promise<Booking> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // TODO: return axiosInstance.put(`/api/manager/bookings/${data.id}`, data).then(res => res.data);

    const index = bookingsStore.findIndex(booking => booking.id === data.id);
    if (index === -1) {
      throw new Error(`Booking with id ${data.id} not found`);
    }

    const updatedBooking: Booking = {
      ...bookingsStore[index],
      ...data,
      customer: data.customerName
        ? {
            ...bookingsStore[index].customer,
            name: data.customerName,
            department: data.customerDepartment,
          }
        : bookingsStore[index].customer,
      room: data.roomName
        ? {
            id: data.roomId || bookingsStore[index].room.id,
            name: data.roomName,
            building: data.roomBuilding || bookingsStore[index].room.building,
          }
        : bookingsStore[index].room,
    };

    bookingsStore[index] = updatedBooking;
    console.log('Updated booking:', updatedBooking);
    return updatedBooking;
  },

  updateBookingStatus: async (
    id: string,
    status: BookingStatus
  ): Promise<Booking> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // TODO: return axiosInstance.patch(`/api/manager/bookings/${id}/status`, { status }).then(res => res.data);

    const index = bookingsStore.findIndex(booking => booking.id === id);
    if (index === -1) {
      throw new Error(`Booking with id ${id} not found`);
    }

    bookingsStore[index] = {
      ...bookingsStore[index],
      status,
    };

    console.log('Updated booking status:', id, status);
    return bookingsStore[index];
  },

  cancelBooking: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // TODO: return axiosInstance.delete(`/api/manager/bookings/${id}`).then(res => res.data);

    const index = bookingsStore.findIndex(booking => booking.id === id);
    if (index === -1) {
      throw new Error(`Booking with id ${id} not found`);
    }

    bookingsStore[index] = {
      ...bookingsStore[index],
      status: 'cancelled',
    };

    console.log('Cancelled booking:', id);
  },

  getBookingStats: async (): Promise<{
    total: number;
    confirmed: number;
    pending: number;
    completed: number;
    cancelled: number;
  }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    // TODO: return axiosInstance.get('/api/manager/bookings/stats').then(res => res.data);

    return {
      total: bookingsStore.length,
      confirmed: bookingsStore.filter(b => b.status === 'confirmed').length,
      pending: bookingsStore.filter(b => b.status === 'pending').length,
      completed: bookingsStore.filter(b => b.status === 'completed').length,
      cancelled: bookingsStore.filter(b => b.status === 'cancelled').length,
    };
  },
};

export default bookingService;
