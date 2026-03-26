import { PaymentMethod, TransactionStatus } from '@prisma/client';
import { BadRequestError } from '../core/error.response';
import {
  ITransactionRepository,
  RevenueReportInput,
  TransactionFilterInput,
} from '../interface/transaction.repository.interface';
import { prisma } from '../lib/prisma';

export default class TransactionService {
  constructor(private transactionRepo: ITransactionRepository) {}

  async getMyTransactions(
    userId: string,
    filter: {
      paymentMethod?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    },
  ) {
    return this.transactionRepo.findMany({
      userId,
      ...this.parseFilter(filter),
    });
  }

  async getAllTransactions(filter: {
    userId?: string;
    paymentMethod?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) {
    return this.transactionRepo.findMany(this.parseFilter(filter));
  }

  async getTransactionById(id: string) {
    const tx = await this.transactionRepo.findById(id);
    if (!tx) throw new BadRequestError('Transaction not found');
    return tx;
  }

  async getRevenueReport(input: {
    startDate: string;
    endDate: string;
    groupBy?: string;
    managerId?: string;
  }) {
    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new BadRequestError('Invalid date range');
    }
    if (startDate > endDate) {
      throw new BadRequestError('startDate must be before endDate');
    }

    const allowedGroupBy = ['day', 'month', 'room', 'building', 'paymentMethod'];
    const groupBy = (input.groupBy ?? 'day') as RevenueReportInput['groupBy'];
    if (!allowedGroupBy.includes(groupBy)) {
      throw new BadRequestError(
        `Invalid groupBy. Allowed: ${allowedGroupBy.join(', ')}`,
      );
    }

    const [summary, totalRevenue, paymentMethodBreakdown] = await Promise.all([
      this.transactionRepo.getRevenueSummary({
        startDate,
        endDate,
        groupBy,
        managerId: input.managerId,
      }),
      this.transactionRepo.getTotalRevenue(startDate, endDate, input.managerId),
      this.transactionRepo.getRevenueSummary({
        startDate,
        endDate,
        groupBy: 'paymentMethod',
        managerId: input.managerId,
      }),
    ]);

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      groupBy,
      totalRevenue,
      paymentMethodBreakdown,
      data: summary,
    };
  }

  async getBookingReport(input: {
    startDate: string;
    endDate: string;
    managerId?: string;
  }) {
    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new BadRequestError('Invalid date range');
    }

    const roomWhere = input.managerId
      ? { room: { managerId: input.managerId } }
      : {};

    const [statusCounts, totalBookings, recentBookings] = await Promise.all([
      prisma.bookingRequest.groupBy({
        by: ['status'],
        where: {
          createdAt: { gte: startDate, lte: endDate },
          ...roomWhere,
        },
        _count: { id: true },
      }),
      prisma.bookingRequest.count({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          ...roomWhere,
        },
      }),
      prisma.booking.findMany({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          status: 'COMPLETED',
          ...roomWhere,
        },
        include: {
          room: { select: { id: true, name: true } },
          user: { select: { id: true, name: true, email: true } },
          transaction: { select: { amount: true, paymentMethod: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
    ]);

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalRequests: totalBookings,
      byStatus: Object.fromEntries(
        statusCounts.map((r) => [r.status, r._count.id]),
      ),
      recentCompletedBookings: recentBookings,
    };
  }

  private parseFilter(filter: {
    userId?: string;
    paymentMethod?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): TransactionFilterInput {
    const result: TransactionFilterInput = {
      page: filter.page ? Number(filter.page) : 1,
      limit: filter.limit ? Math.min(Number(filter.limit), 100) : 20,
    };

    if (filter.userId) result.userId = filter.userId;

    if (filter.paymentMethod) {
      const allowed: PaymentMethod[] = ['VNPAY', 'CASH', 'BANK_TRANSFER'];
      const method = filter.paymentMethod.toUpperCase() as PaymentMethod;
      if (!allowed.includes(method))
        throw new BadRequestError('Invalid paymentMethod filter');
      result.paymentMethod = method;
    }

    if (filter.status) {
      const allowed: TransactionStatus[] = ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'];
      const status = filter.status.toUpperCase() as TransactionStatus;
      if (!allowed.includes(status))
        throw new BadRequestError('Invalid status filter');
      result.status = status;
    }

    if (filter.startDate) result.startDate = new Date(filter.startDate);
    if (filter.endDate) result.endDate = new Date(filter.endDate);

    return result;
  }
}
