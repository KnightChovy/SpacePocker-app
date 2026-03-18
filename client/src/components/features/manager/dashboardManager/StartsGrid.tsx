import { useMemo } from 'react';
import {
  CalendarCheck,
  CircleDollarSign,
  Building2,
  DoorClosed,
  type LucideIcon,
} from 'lucide-react';
import { useGetBuildings } from '@/hooks/manager/buildings/use-get-buildings';
import { useGetRooms } from '@/hooks/manager/rooms/use-get-rooms';
import { useGetBookingRequestsForManager } from '@/hooks/manager/booking-requests/use-get-booking-requests';
import type { BookingRequestForManager } from '@/types/booking-request-api';
import { formatVND } from '@/lib/utils';

interface StatsGridProps {
  // Kept for backward compatibility with existing page usage.
  // The manager dashboard now fetches real data directly in this component.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stats?: any[];
  paidRange?: '3m' | '30d' | '7d';
}

interface IconConfig {
  Icon: LucideIcon;
  bgColor: string;
  iconColor: string;
  borderColor: string;
}

type DashboardStatType = 'paid' | 'buildings' | 'rooms' | 'bookings';

interface DashboardStat {
  label: string;
  value: string | number;
  subtext?: string;
  type: DashboardStatType;
  badgeText?: string;
}

const isActiveBooking = (booking: BookingRequestForManager, now: Date) => {
  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);

  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime())) {
    return false;
  }

  return start <= now && now <= end;
};

const StatCard = ({
  label,
  value,
  subtext,
  type,
  badgeText,
}: DashboardStat) => {
  const getIconConfig = (): IconConfig => {
    switch (type) {
      case 'paid':
        return {
          Icon: CircleDollarSign,
          bgColor: 'bg-blue-50',
          iconColor: 'text-blue-500',
          borderColor: 'border-blue-100',
        };
      case 'bookings':
        return {
          Icon: CalendarCheck,
          bgColor: 'bg-amber-50',
          iconColor: 'text-amber-500',
          borderColor: 'border-amber-100',
        };
      case 'buildings':
        return {
          Icon: Building2,
          bgColor: 'bg-slate-50',
          iconColor: 'text-slate-600',
          borderColor: 'border-slate-100',
        };
      case 'rooms':
        return {
          Icon: DoorClosed,
          bgColor: 'bg-emerald-50',
          iconColor: 'text-emerald-600',
          borderColor: 'border-emerald-100',
        };
    }
  };

  const { Icon, bgColor, iconColor, borderColor } = getIconConfig();

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-soft hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div
          className={`size-11 rounded-xl ${bgColor} border ${borderColor} flex items-center justify-center`}
        >
          <Icon className={`size-5 ${iconColor}`} />
        </div>
        {badgeText && (
          <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">
            {badgeText}
          </span>
        )}
      </div>

      <div className="mb-1">
        <span className="text-text-gray text-xs font-semibold uppercase tracking-wider">
          {label}
        </span>
        <div className="text-2xl font-bold text-text-dark mt-1">{value}</div>
      </div>

      {subtext && <p className="text-xs text-text-gray mt-1">{subtext}</p>}
    </div>
  );
};

const getPaidRangeCutoff = (now: Date, paidRange: '3m' | '30d' | '7d') => {
  const cutoff = new Date(now);
  switch (paidRange) {
    case '7d':
      cutoff.setDate(cutoff.getDate() - 7);
      return cutoff;
    case '30d':
      cutoff.setDate(cutoff.getDate() - 30);
      return cutoff;
    case '3m':
      cutoff.setMonth(cutoff.getMonth() - 3);
      return cutoff;
  }
  return cutoff;
};

export const StatsGrid = ({ stats, paidRange = '30d' }: StatsGridProps) => {
  const buildingsQuery = useGetBuildings({ limit: 1, offset: 0 });
  // Use a higher limit so we can compute totals that depend on room pricing.
  // Pagination.total still drives the room count card.
  const roomsQuery = useGetRooms({ limit: 1000, offset: 0 });
  const approvedRequestsQuery = useGetBookingRequestsForManager('APPROVED');
  const completedRequestsQuery = useGetBookingRequestsForManager('COMPLETED');

  const dashboardStats: DashboardStat[] = useMemo(() => {
    const buildingsTotal = buildingsQuery.data?.pagination.total;
    const roomsTotal = roomsQuery.data?.pagination.total;

    const approved = approvedRequestsQuery.data ?? [];
    const completed = completedRequestsQuery.data ?? [];

    const priceByRoomId = new Map<string, number>();
    for (const room of roomsQuery.data?.rooms ?? []) {
      priceByRoomId.set(room.id, room.pricePerHour ?? 0);
    }

    const now = new Date();
    const activeBookings = approved.filter(b => isActiveBooking(b, now)).length;

    const paidCutoff = getPaidRangeCutoff(now, paidRange);

    const totalPaid = completed.reduce((sum, req) => {
      const start = new Date(req.startTime);
      const end = new Date(req.endTime);
      if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()))
        return sum;

      if (end < paidCutoff) return sum;

      const hours = Math.max(0, (end.getTime() - start.getTime()) / 3_600_000);
      const pricePerHour = priceByRoomId.get(req.roomId) ?? 0;
      return sum + hours * pricePerHour;
    }, 0);

    const safeBuildingsTotal =
      typeof buildingsTotal === 'number' ? buildingsTotal : 0;
    const safeRoomsTotal = typeof roomsTotal === 'number' ? roomsTotal : 0;
    const computed: DashboardStat[] = [
      {
        type: 'paid',
        label: 'Total Paid',
        value: formatVND(Math.round(totalPaid)),
        subtext: 'Successful payments',
      },
      {
        type: 'buildings',
        label: 'Total Buildings',
        value: safeBuildingsTotal,
        subtext: 'Across your portfolio',
      },
      {
        type: 'rooms',
        label: 'Total Rooms',
        value: safeRoomsTotal,
        subtext: 'Rooms under management',
      },
      {
        type: 'bookings',
        label: 'Active Bookings',
        value: activeBookings,
        subtext: 'Currently ongoing',
      },
    ];

    // If loading and legacy stats exist, keep UI filled temporarily.
    if (
      (buildingsQuery.isLoading || roomsQuery.isLoading) &&
      Array.isArray(stats) &&
      stats.length > 0
    ) {
      return computed.map((s, idx) => {
        const legacy = stats[idx];
        return legacy?.value !== undefined ? { ...s, value: legacy.value } : s;
      });
    }

    return computed;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    buildingsQuery.data?.pagination.total,
    roomsQuery.data?.pagination.total,
    roomsQuery.data?.rooms,
    approvedRequestsQuery.data,
    completedRequestsQuery.data,
    paidRange,
    buildingsQuery.isLoading,
    roomsQuery.isLoading,
    stats,
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {dashboardStats.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  );
};
