import { PaymentMethod, Transaction, TransactionStatus } from '@prisma/client';

export interface CreateTransactionInput {
  bookingId?: string;
  bookingRequestId?: string;
  userId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status?: TransactionStatus;
  txnRef?: string;
  note?: string;
  paidAt?: Date;
  confirmedBy?: string;
}

export interface TransactionFilterInput {
  userId?: string;
  managerId?: string;
  paymentMethod?: PaymentMethod;
  status?: TransactionStatus;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export interface RevenueReportInput {
  startDate: Date;
  endDate: Date;
  groupBy: 'day' | 'month' | 'room' | 'building' | 'paymentMethod';
  managerId?: string;
}

export interface ITransactionRepository {
  create(data: CreateTransactionInput): Promise<Transaction>;
  findById(id: string): Promise<Transaction | null>;
  findByBookingId(bookingId: string): Promise<Transaction | null>;
  findMany(filter: TransactionFilterInput): Promise<{
    data: Transaction[];
    total: number;
  }>;
  updateStatus(
    id: string,
    status: TransactionStatus,
    extra?: { paidAt?: Date; note?: string },
  ): Promise<Transaction>;
  getRevenueSummary(input: RevenueReportInput): Promise<unknown[]>;
  getTotalRevenue(startDate: Date, endDate: Date, managerId?: string): Promise<number>;
}
