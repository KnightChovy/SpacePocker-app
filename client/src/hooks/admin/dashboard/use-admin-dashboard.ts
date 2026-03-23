import { useQuery } from '@tanstack/react-query';
import { adminDashboardApi } from '@/apis/admin/dashboard.api';
import { getAvatarUrl } from '@/lib/utils';
import type { BookingRequestForManager } from '@/types/user/booking-request-api';
import type { LogEntry, Transaction } from '@/types/admin/admin-types';

type DashboardIconKey = 'DollarSign' | 'Building2' | 'UserPlus' | 'Server';

export interface DashboardStatData {
  label: string;
  value: string;
  trend: string;
  trendType: 'up' | 'down';
  icon: DashboardIconKey;
}

export interface DashboardRoleData {
  renters: number;
  hosts: number;
  admins: number;
}

export interface DashboardChartPoint {
  name: string;
  value: number;
}

export interface AdminDashboardData {
  stats: DashboardStatData[];
  transactions: Transaction[];
  logs: LogEntry[];
  transactionChart: DashboardChartPoint[];
  userAcquisition: DashboardRoleData;
}

const VIETNAM_LOCALE = 'vi-VN';

const toPercentText = (current: number, previous: number) => {
  if (current <= 0 && previous <= 0) {
    return { text: '0%', trendType: 'up' as const };
  }

  if (previous <= 0) {
    return { text: '100%', trendType: 'up' as const };
  }

  const delta = ((current - previous) / previous) * 100;
  const rounded = Math.round(Math.abs(delta));
  return {
    text: `${rounded}%`,
    trendType: delta >= 0 ? ('up' as const) : ('down' as const),
  };
};

const toMonthLabels = () => [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const getEstimatedAmount = (
  request: BookingRequestForManager,
  roomPriceById: Map<string, number>
) => {
  const start = new Date(request.startTime).getTime();
  const end = new Date(request.endTime).getTime();
  const durationMs = Math.max(end - start, 0);
  const durationHours = Math.max(durationMs / (1000 * 60 * 60), 1);
  const pricePerHour = roomPriceById.get(request.roomId) ?? 0;

  return Math.round(durationHours * pricePerHour);
};

const isCurrentWindow = (time: number, now: number) => {
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  return time >= now - THIRTY_DAYS_MS && time <= now;
};

const isPreviousWindow = (time: number, now: number) => {
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  const currentStart = now - THIRTY_DAYS_MS;
  const previousStart = currentStart - THIRTY_DAYS_MS;
  return time >= previousStart && time < currentStart;
};

const toTransactionStatus = (
  status: BookingRequestForManager['status']
): Transaction['status'] => {
  if (status === 'PENDING') {
    return 'Pending';
  }

  if (status === 'REJECTED' || status === 'CANCELLED') {
    return 'Failed';
  }

  return 'Completed';
};

const toLogType = (
  status: BookingRequestForManager['status']
): LogEntry['type'] => {
  if (status === 'REJECTED' || status === 'CANCELLED') {
    return 'error';
  }

  if (status === 'APPROVED' || status === 'COMPLETED') {
    return 'success';
  }

  return 'info';
};

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'overview'],
    queryFn: async (): Promise<AdminDashboardData> => {
      const { usersAll, managerUsers, adminUsers, rooms, bookingRequests } =
        await adminDashboardApi.getSources();

      const roomPriceById = new Map(
        (rooms.rooms ?? []).map(room => [room.id, room.pricePerHour])
      );

      const now = Date.now();

      const successfulRequests = bookingRequests.filter(
        request =>
          request.status === 'APPROVED' || request.status === 'COMPLETED'
      );

      const currentRevenue = successfulRequests
        .filter(request =>
          isCurrentWindow(new Date(request.createdAt).getTime(), now)
        )
        .reduce(
          (sum, request) => sum + getEstimatedAmount(request, roomPriceById),
          0
        );

      const previousRevenue = successfulRequests
        .filter(request =>
          isPreviousWindow(new Date(request.createdAt).getTime(), now)
        )
        .reduce(
          (sum, request) => sum + getEstimatedAmount(request, roomPriceById),
          0
        );

      const currentActiveSpaces = new Set(
        successfulRequests
          .filter(request =>
            isCurrentWindow(new Date(request.createdAt).getTime(), now)
          )
          .map(request => request.roomId)
      ).size;

      const previousActiveSpaces = new Set(
        successfulRequests
          .filter(request =>
            isPreviousWindow(new Date(request.createdAt).getTime(), now)
          )
          .map(request => request.roomId)
      ).size;

      const currentNewUsers = (usersAll.users ?? []).filter(user =>
        isCurrentWindow(new Date(user.createdAt).getTime(), now)
      ).length;

      const previousNewUsers = (usersAll.users ?? []).filter(user =>
        isPreviousWindow(new Date(user.createdAt).getTime(), now)
      ).length;

      const currentBookingRequests = bookingRequests.filter(request =>
        isCurrentWindow(new Date(request.createdAt).getTime(), now)
      ).length;

      const previousBookingRequests = bookingRequests.filter(request =>
        isPreviousWindow(new Date(request.createdAt).getTime(), now)
      ).length;

      const revenueTrend = toPercentText(currentRevenue, previousRevenue);
      const activeSpacesTrend = toPercentText(
        currentActiveSpaces,
        previousActiveSpaces
      );
      const totalUsersTrend = toPercentText(currentNewUsers, previousNewUsers);
      const bookingRequestsTrend = toPercentText(
        currentBookingRequests,
        previousBookingRequests
      );

      const stats: DashboardStatData[] = [
        {
          label: 'Total Revenue',
          value: new Intl.NumberFormat(VIETNAM_LOCALE).format(currentRevenue),
          trend: revenueTrend.text,
          trendType: revenueTrend.trendType,
          icon: 'DollarSign',
        },
        {
          label: 'Active Spaces',
          value: new Intl.NumberFormat(VIETNAM_LOCALE).format(
            rooms.pagination?.total ?? 0
          ),
          trend: activeSpacesTrend.text,
          trendType: activeSpacesTrend.trendType,
          icon: 'Building2',
        },
        {
          label: 'Total Users',
          value: new Intl.NumberFormat(VIETNAM_LOCALE).format(
            usersAll.pagination?.total ?? 0
          ),
          trend: totalUsersTrend.text,
          trendType: totalUsersTrend.trendType,
          icon: 'UserPlus',
        },
        {
          label: 'Booking Requests',
          value: new Intl.NumberFormat(VIETNAM_LOCALE).format(
            bookingRequests.length
          ),
          trend: bookingRequestsTrend.text,
          trendType: bookingRequestsTrend.trendType,
          icon: 'Server',
        },
      ];

      const transactions = [...bookingRequests]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 8)
        .map(request => ({
          id: `#${request.id.slice(0, 8).toUpperCase()}`,
          userName: request.user?.name ?? 'Unknown user',
          userAvatar: getAvatarUrl(request.user?.name, 'User'),
          spaceName: request.room?.name ?? 'Unknown room',
          date: new Date(request.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          }),
          amount: getEstimatedAmount(request, roomPriceById),
          status: toTransactionStatus(request.status),
        }));

      const logs = [...bookingRequests]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 6)
        .map(request => ({
          timestamp: new Date(request.createdAt).toLocaleTimeString('en-GB', {
            hour12: false,
          }),
          message: `Booking ${request.status.toLowerCase()}: ${request.user?.name ?? 'Unknown'} - ${request.room?.name ?? 'Unknown room'}`,
          type: toLogType(request.status),
        }));

      const months = toMonthLabels();
      const thisYear = new Date(now).getFullYear();
      const revenueByMonth = new Array(12).fill(0);

      successfulRequests.forEach(request => {
        const createdAt = new Date(request.createdAt);
        if (createdAt.getFullYear() !== thisYear) {
          return;
        }

        const monthIndex = createdAt.getMonth();
        revenueByMonth[monthIndex] += getEstimatedAmount(
          request,
          roomPriceById
        );
      });

      const transactionChart = months.map((name, idx) => ({
        name,
        value: revenueByMonth[idx],
      }));

      const userAcquisition: DashboardRoleData = {
        renters: Math.max(
          (usersAll.pagination?.total ?? 0) -
            (managerUsers.pagination?.total ?? 0) -
            (adminUsers.pagination?.total ?? 0),
          0
        ),
        hosts: managerUsers.pagination?.total ?? 0,
        admins: adminUsers.pagination?.total ?? 0,
      };

      return {
        stats,
        transactions,
        logs,
        transactionChart,
        userAcquisition,
      };
    },
  });
};
