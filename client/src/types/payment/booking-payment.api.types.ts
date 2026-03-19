export interface PaymentUrlResponse {
  paymentUrl: string;
  bookingRequestId: string;
}

export type GetPaymentUrlRequest = { bookingRequestId: string };
export type GetPaymentUrlResponse = PaymentUrlResponse;
