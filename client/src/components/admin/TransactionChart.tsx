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

const data = [
  { name: 'Jan', value: 3000 },
  { name: 'Feb', value: 3500 },
  { name: 'Mar', value: 2800 },
  { name: 'Apr', value: 4200 },
  { name: 'May', value: 3800 },
  { name: 'Jun', value: 5000 },
  { name: 'Jul', value: 4500 },
  { name: 'Aug', value: 5800 },
  { name: 'Sep', value: 5200 },
  { name: 'Oct', value: 6500 },
  { name: 'Nov', value: 6000 },
  { name: 'Dec', value: 7200 },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white px-3 py-2 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 border border-gray-700">
        <span>${payload[0].value.toLocaleString()}</span>
        <span className="text-emerald-400">▲ 14%</span>
      </div>
    );
  }
  return null;
};

const TransactionChart: React.FC = () => {
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
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
            <span className="text-xs font-bold text-gray-500">Last Year</span>
          </div>
        </div>
      </div>

      <div className="h-[350px] w-full">
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
