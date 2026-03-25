import axiosClient from '@/api/axiosClient';
import { ApiResponse } from '@/types/api.type';
import {
  Booking,
  BookingFilterState,
  CreateBookingPaymentUrlResponse,
  CreateBookingRequest,
} from '@/types/booking.type';

const bookingService = {
  createBooking: async (
    data: CreateBookingRequest
  ): Promise<ApiResponse<CreateBookingPaymentUrlResponse>> => {
    const res = await axiosClient.post<
      ApiResponse<CreateBookingPaymentUrlResponse>
    >('/mobile/booking-requests/payment-url', data);
    return res.data;
  },

  getMyBookings: async (
    params?: Partial<BookingFilterState>
  ): Promise<ApiResponse<Booking[]>> => {
    const res = await axiosClient.get<ApiResponse<Booking[]>>(
      '/my-booking-requests',
      { params }
    );
    return res.data;
  },

  getBookingById: async (id: string): Promise<ApiResponse<Booking>> => {
    const res = await axiosClient.get<ApiResponse<Booking>>(
      `/booking-requests/${id}`
    );
    return res.data;
  },

  cancelBooking: async (id: string): Promise<ApiResponse<Booking>> => {
    const res = await axiosClient.patch<ApiResponse<Booking>>(
      `/booking-requests/${id}/cancel`
    );
    return res.data;
  },
};

export default bookingService;
