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
import { formatVND } from '@/lib/utils';
import type { ChartDataItem } from '@/types/user/types';

interface RevenueOverviewProps {
  data: ChartDataItem[];
  paidRange?: '3m' | '30d' | '7d';
  totalRevenue?: number;
}

const PAID_RANGE_LABEL: Record<
  NonNullable<RevenueOverviewProps['paidRange']>,
  string
> = {
  '3m': 'Last 3 Months',
  '30d': 'Last 30 Days',
  '7d': 'Last 7 Days',
};

export const RevenueOverview: React.FC<RevenueOverviewProps> = ({
  data,
  paidRange = '30d',
  totalRevenue,
}) => {
  const chartData = useMemo(() => data ?? [], [data]);

  const totalForRange = useMemo(
    () =>
      typeof totalRevenue === 'number'
        ? totalRevenue
        : chartData.reduce((sum, p) => sum + p.value, 0),
    [chartData, totalRevenue]
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
        {!hasAnyValue ? (
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
