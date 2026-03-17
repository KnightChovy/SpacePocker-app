import axiosInstance from '@/lib/axios';

export interface PaymentUrlResponse {
  paymentUrl: string;
  bookingRequestId: string;
}

const getPaymentUrl = async (bookingRequestId: string): Promise<string> => {
  const response = await axiosInstance.post(
    `/booking-requests/${bookingRequestId}/payment-url`,
    {}
  );
  return response.data.metadata?.paymentUrl || response.data.paymentUrl;
};

export const bookingPaymentApi = {
  getPaymentUrl,
};
