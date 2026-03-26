import type {
  BookingDistribution,
  ChartDataItem,
  StatItem,
} from '@/types/user/types';
import axiosInstance from '@/lib/axios';
import type { ApiResponse } from '@/apis/api.types';

export type PaidRange = '3m' | '30d' | '7d';
export type RevenueReportGroupBy =
  | 'day'
  | 'month'
  | 'room'
  | 'building'
  | 'paymentMethod';

export type RevenueReportPoint = {
  period?: string;
  totalAmount: number;
  count: number;
};

export type RevenueReportMetadata = {
  startDate: string;
  endDate: string;
  groupBy: RevenueReportGroupBy;
  totalRevenue: number;
  paymentMethodBreakdown: Array<{
    paymentMethod: string;
    totalAmount: number;
    count: number;
  }>;
  data: RevenueReportPoint[];
};

export type BookingReportRecentBooking = {
  id: string;
  createdAt: string;
  status: string;
  room?: { id: string; name: string } | null;
  user?: { id: string; name: string; email: string } | null;
  transaction?: { amount: number; paymentMethod: string } | null;
};

export type BookingReportMetadata = {
  startDate: string;
  endDate: string;
  totalRequests: number;
  byStatus: Record<string, number>;
  recentCompletedBookings: BookingReportRecentBooking[];
};

const getRevenueQueryByRange = (paidRange: PaidRange) => {
  const endDate = new Date();

  if (paidRange === '3m') {
    const startDate = new Date(
      endDate.getFullYear(),
      endDate.getMonth() - 2,
      1
    );
    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      groupBy: 'month' as const,
    };
  }

  const days = paidRange === '7d' ? 6 : 29;
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - days);

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    groupBy: 'day' as const,
  };
};

const toLabel = (period: string, groupBy: 'day' | 'month') => {
  const date = new Date(period);
  if (!Number.isFinite(date.getTime())) return period;

  if (groupBy === 'month') {
    return new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const dashboardService = {
  getStats: async (): Promise<StatItem[]> => {
    return [
      { label: 'Total Bookings', value: 0, type: 'bookings' },
      { label: 'Revenue', value: 0, type: 'revenue' },
      { label: 'Occupancy', value: '0%', type: 'occupancy' },
      { label: 'Inquiries', value: 0, type: 'inquiries' },
    ];
  },

  getRevenueData: async (): Promise<ChartDataItem[]> => {
    return [
      { name: 'Mon', value: 0 },
      { name: 'Tue', value: 0 },
      { name: 'Wed', value: 0 },
      { name: 'Thu', value: 0 },
      { name: 'Fri', value: 0 },
      { name: 'Sat', value: 0 },
      { name: 'Sun', value: 0 },
    ];
  },

  getRevenueReport: async (input: {
    startDate: string;
    endDate: string;
    groupBy: RevenueReportGroupBy;
    managerId?: string;
  }): Promise<RevenueReportMetadata> => {
    const response = await axiosInstance.get<
      ApiResponse<RevenueReportMetadata>
    >('/reports/revenue', {
      params: {
        startDate: input.startDate,
        endDate: input.endDate,
        groupBy: input.groupBy,
        managerId: input.managerId,
      },
    });

    return {
      ...response.data.metadata,
      totalRevenue: Number(response.data.metadata?.totalRevenue ?? 0),
      data: response.data.metadata?.data ?? [],
      paymentMethodBreakdown:
        response.data.metadata?.paymentMethodBreakdown ?? [],
    };
  },

  getRevenueReportData: async (input: {
    paidRange: PaidRange;
    managerId?: string;
  }): Promise<{ chartData: ChartDataItem[]; totalRevenue: number }> => {
    const query = getRevenueQueryByRange(input.paidRange);

    const metadata = await dashboardService.getRevenueReport({
      startDate: query.startDate,
      endDate: query.endDate,
      groupBy: query.groupBy,
      managerId: input.managerId,
    });
    const groupBy = metadata.groupBy === 'month' ? 'month' : 'day';

    const chartData = (metadata.data ?? []).map(point => ({
      name: toLabel(point.period ?? '', groupBy),
      value: Number(point.totalAmount ?? 0),
    }));

    return {
      chartData,
      totalRevenue: Number(metadata.totalRevenue ?? 0),
    };
  },

  getBookingReportData: async (input: {
    paidRange: PaidRange;
    managerId?: string;
  }): Promise<BookingReportMetadata> => {
    const query = getRevenueQueryByRange(input.paidRange);

    const response = await axiosInstance.get<
      ApiResponse<BookingReportMetadata>
    >('/reports/bookings', {
      params: {
        startDate: query.startDate,
        endDate: query.endDate,
        managerId: input.managerId,
      },
    });

    return {
      ...response.data.metadata,
      totalRequests: Number(response.data.metadata?.totalRequests ?? 0),
      byStatus: response.data.metadata?.byStatus ?? {},
      recentCompletedBookings:
        response.data.metadata?.recentCompletedBookings ?? [],
    };
  },

  getRoomTypeDistribution: async (): Promise<BookingDistribution[]> => {
    return [
      { roomType: 'MEETING', booked: 0, available: 0 },
      { roomType: 'CLASSROOM', booked: 0, available: 0 },
      { roomType: 'EVENT', booked: 0, available: 0 },
    ];
  },
};
