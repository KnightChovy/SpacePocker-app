import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card } from '@/components/common/Card';
import { useGetBookingRequestsForManager } from '@/hooks/manager/booking-requests/use-get-booking-requests';
import { useGetRooms } from '@/hooks/manager/rooms/use-get-rooms';
import type { BookingRequestForManager } from '@/types/user/booking-request-api';
import { formatVND } from '@/lib/utils';

interface RevenueOverviewProps {
  // Kept for backward compatibility with existing page usage.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  paidRange?: '3m' | '30d' | '7d';
}

type TotalPaidChartPoint = {
  name: string;
  value: number;
};

const PAID_RANGE_LABEL: Record<
  NonNullable<RevenueOverviewProps['paidRange']>,
  string
> = {
  '3m': 'Last 3 Months',
  '30d': 'Last 30 Days',
  '7d': 'Last 7 Days',
};

const monthKey = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}-${String(month).padStart(2, '0')}`;
};

const addMonths = (date: Date, deltaMonths: number) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + deltaMonths);
  return d;
};

const dayKey = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const addDays = (date: Date, deltaDays: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + deltaDays);
  return d;
};

const toDayLabel = (key: string) => {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(date);
};

const toMonthLabel = (key: string) => {
  const [y, m] = key.split('-').map(Number);
  const d = new Date(y, (m ?? 1) - 1, 1);
  return new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
};

const calcRequestAmount = (
  req: BookingRequestForManager,
  priceByRoomId: Map<string, number>
) => {
  const start = new Date(req.startTime);
  const end = new Date(req.endTime);
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()))
    return 0;

  const hours = Math.max(0, (end.getTime() - start.getTime()) / 3_600_000);
  const pricePerHour = priceByRoomId.get(req.roomId) ?? 0;
  return hours * pricePerHour;
};

export const RevenueOverview: React.FC<RevenueOverviewProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  data: _data,
  paidRange = '30d',
}) => {
  const roomsQuery = useGetRooms({ limit: 1000, offset: 0 });
  const completedRequestsQuery = useGetBookingRequestsForManager('COMPLETED');

  const chartData: TotalPaidChartPoint[] = useMemo(() => {
    const completed = completedRequestsQuery.data ?? [];

    const priceByRoomId = new Map<string, number>();
    for (const room of roomsQuery.data?.rooms ?? []) {
      priceByRoomId.set(room.id, room.pricePerHour ?? 0);
    }

    const now = new Date();

    if (paidRange === '3m') {
      // Monthly totals for last 3 months (including current month).
      const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const months: string[] = [];
      for (let i = 2; i >= 0; i -= 1) {
        months.push(monthKey(addMonths(startMonth, -i)));
      }

      const totalsByMonth = new Map<string, number>(months.map(k => [k, 0]));
      for (const req of completed) {
        const end = new Date(req.endTime);
        if (!Number.isFinite(end.getTime())) continue;
        const key = monthKey(new Date(end.getFullYear(), end.getMonth(), 1));
        if (!totalsByMonth.has(key)) continue;
        totalsByMonth.set(
          key,
          (totalsByMonth.get(key) ?? 0) + calcRequestAmount(req, priceByRoomId)
        );
      }

      return months.map(k => ({
        name: toMonthLabel(k),
        value: totalsByMonth.get(k) ?? 0,
      }));
    }

    // Daily totals for last 30/7 days (including today).
    const daysCount = paidRange === '7d' ? 7 : 30;
    const endDay = startOfDay(now);
    const startDay = addDays(endDay, -(daysCount - 1));

    const days: string[] = [];
    for (let i = 0; i < daysCount; i += 1) {
      days.push(dayKey(addDays(startDay, i)));
    }

    const totalsByDay = new Map<string, number>(days.map(k => [k, 0]));
    for (const req of completed) {
      const end = new Date(req.endTime);
      if (!Number.isFinite(end.getTime())) continue;
      const endDayKey = dayKey(startOfDay(end));
      if (!totalsByDay.has(endDayKey)) continue;
      totalsByDay.set(
        endDayKey,
        (totalsByDay.get(endDayKey) ?? 0) +
          calcRequestAmount(req, priceByRoomId)
      );
    }

    return days.map(k => ({
      name: toDayLabel(k),
      value: totalsByDay.get(k) ?? 0,
    }));
  }, [completedRequestsQuery.data, roomsQuery.data?.rooms, paidRange]);

  const isLoading = roomsQuery.isLoading || completedRequestsQuery.isLoading;
  const totalForRange = useMemo(
    () => chartData.reduce((sum, p) => sum + p.value, 0),
    [chartData]
  );
  const hasAnyValue = totalForRange > 0;

  const xInterval = paidRange === '30d' ? 4 : 0;

  return (
    <Card
      title="Total Paid Overview"
      subtitle={`Successful payments (${PAID_RANGE_LABEL[paidRange]}) · Total: ${formatVND(
        Math.round(totalForRange)
      )}`}
      headerAction={
        <button className="p-1 text-gray-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      }
    >
      <div className="h-64 w-full">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-500">
            Loading chart...
          </div>
        ) : !hasAnyValue ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-500">
            No payment data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorTotalPaid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6764f2" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6764f2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f1f1"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                interval={xInterval}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                tickFormatter={(value: number) => formatVND(value)}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
                formatter={value =>
                  value !== undefined
                    ? [formatVND(Math.round(Number(value))), 'Total Paid']
                    : null
                }
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#6764f2"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorTotalPaid)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};
