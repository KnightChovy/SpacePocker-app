import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatVND } from '@/lib/utils';

interface TransactionChartPoint {
  name: string;
  value: number;
}

interface Props {
  data: TransactionChartPoint[];
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number }[];
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white px-3 py-2 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 border border-gray-700">
        <span>{formatVND(payload[0].value)}</span>
        <span className="text-emerald-400">▲ 14%</span>
      </div>
    );
  }
  return null;
};

const TransactionChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Gross Transaction Volume
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Income from all active rentals over time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.5)]"></div>
            <span className="text-xs font-bold text-indigo-700">
              Current Year
            </span>
          </div>
        </div>
      </div>

      <div className="h-87.5 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="#f1f5f9"
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }}
              dy={15}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: '#6366f1',
                strokeWidth: 1,
                strokeDasharray: '4 4',
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorValue)"
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TransactionChart;
