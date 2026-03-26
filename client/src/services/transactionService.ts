import axiosInstance from '@/lib/axios';
import type { ApiResponse } from '@/apis/api.types';

export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
export type TransactionPaymentMethod = 'VNPAY' | 'CASH' | 'BANK_TRANSFER';

export interface TransactionUser {
  id: string;
  name: string;
  email: string;
}

export interface TransactionBooking {
  id: string;
  room?: {
    id: string;
    name: string;
    building?: {
      id: string;
      buildingName: string;
    };
  };
}

export interface TransactionItem {
  id: string;
  bookingId: string | null;
  bookingRequestId: string | null;
  userId: string;
  amount: number;
  paymentMethod: TransactionPaymentMethod;
  status: TransactionStatus;
  txnRef: string | null;
  note: string | null;
  paidAt: string | null;
  createdAt: string;
  user?: TransactionUser;
  booking?: TransactionBooking;
}

export interface TransactionListResult {
  data: TransactionItem[];
  total: number;
}

export interface GetTransactionsParams {
  page?: number;
  limit?: number;
  status?: TransactionStatus;
  paymentMethod?: TransactionPaymentMethod;
  startDate?: string;
  endDate?: string;
  userId?: string;
}

const getAllTransactions = async (
  params?: GetTransactionsParams
): Promise<TransactionListResult> => {
  const response = await axiosInstance.get<ApiResponse<TransactionListResult>>(
    '/transactions',
    { params }
  );

  return response.data.metadata;
};

export const transactionService = {
  getAllTransactions,
};
