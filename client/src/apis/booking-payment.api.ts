import axiosInstance from '@/lib/axios';
import type { ApiResponse } from '@/apis/api.types';

import type { GetPaymentUrlResponse } from '@/types/payment/booking-payment.api.types';

export type {
  GetPaymentUrlRequest,
  GetPaymentUrlResponse,
  PaymentUrlResponse,
} from '@/types/payment/booking-payment.api.types';

type PaymentUrlServerResponse = ApiResponse<GetPaymentUrlResponse> &
  Partial<GetPaymentUrlResponse>;

const getPaymentUrl = async (bookingRequestId: string): Promise<string> => {
  const response = await axiosInstance.post<PaymentUrlServerResponse>(
    `/booking-requests/${bookingRequestId}/payment-url`,
    {}
  );

  // Some server responses may include `paymentUrl` outside of `metadata`.
  return response.data.metadata?.paymentUrl || response.data.paymentUrl || '';
};

export const bookingPaymentApi = {
  getPaymentUrl,
};
