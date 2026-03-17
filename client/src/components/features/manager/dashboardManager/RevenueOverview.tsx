import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '@/components/common/Card';
import type { ChartDataItem } from '@/types/types';
import { formatVND } from '@/lib/utils';

interface RevenueOverviewProps {
  data: ChartDataItem[];
}

export const RevenueOverview: React.FC<RevenueOverviewProps> = ({ data }) => {
  return (
    <Card
      title="Revenue Overview"
      subtitle="Monthly performance across all buildings"
      headerAction={
        <button className="p-1 text-gray-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      }
    >
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
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
                  ? [formatVND(Number(value)), 'Revenue']
                  : null
              }
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#6764f2"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
