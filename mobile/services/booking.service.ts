import axiosClient from '@/api/axiosClient';
import { ApiResponse } from '@/types/api.type';
import {
  Booking,
  BookingFilterState,
  CreateBookingRequest,
  CreateBookingResponse,
} from '@/types/booking.type';

const bookingService = {
  createBooking: async (
    data: CreateBookingRequest
  ): Promise<ApiResponse<CreateBookingResponse>> => {
    const res = await axiosClient.post<ApiResponse<CreateBookingResponse>>(
      '/v1/api/booking-requests',
      data
    );
    return res.data;
  },

  getMyBookings: async (
    params?: Partial<BookingFilterState>
  ): Promise<ApiResponse<Booking[]>> => {
    const res = await axiosClient.get<ApiResponse<Booking[]>>(
      '/v1/api/my-booking-requests',
      { params }
    );
    return res.data;
  },

  getBookingById: async (id: string): Promise<ApiResponse<Booking>> => {
    const res = await axiosClient.get<ApiResponse<Booking>>(
      `/v1/api/booking-requests/${id}`
    );
    return res.data;
  },

  cancelBooking: async (id: string): Promise<ApiResponse<Booking>> => {
    const res = await axiosClient.patch<ApiResponse<Booking>>(
      `/v1/api/booking-requests/${id}/cancel`
    );
    return res.data;
  },
};

export default bookingService;
