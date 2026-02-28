import type { StatItem } from '@/types/types';
import {
  CircleDollarSign,
  CalendarCheck,
  PieChart,
  Bell,
  TrendingUp,
  TrendingDown,
  type LucideIcon,
} from 'lucide-react';

interface StatsGridProps {
  stats: StatItem[];
}

interface IconConfig {
  Icon: LucideIcon;
  bgColor: string;
  iconColor: string;
  borderColor: string;
}

const StatCard = ({ label, value, trend, subtext, type }: StatItem) => {
  const getIconConfig = (): IconConfig => {
    switch (type) {
      case 'revenue':
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
      case 'occupancy':
        return {
          Icon: PieChart,
          bgColor: 'bg-teal-50',
          iconColor: 'text-teal-500',
          borderColor: 'border-teal-100',
        };
      case 'inquiries':
        return {
          Icon: Bell,
          bgColor: 'bg-purple-50',
          iconColor: 'text-purple-500',
          borderColor: 'border-purple-100',
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
        {trend !== undefined && (
          <span
            className={`flex items-center gap-0.5 text-xs font-semibold ${
              trend > 0
                ? 'text-emerald-600 bg-emerald-50'
                : 'text-red-500 bg-red-50'
            } px-2 py-1 rounded-full`}
          >
            {trend > 0 ? (
              <TrendingUp className="size-3.5" />
            ) : (
              <TrendingDown className="size-3.5" />
            )}
            {Math.abs(trend)}%
          </span>
        )}
        {type === 'inquiries' && (
          <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">
            3 New
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

      {type === 'revenue' && (
        <div className="h-10 w-full mt-2">
          <svg
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
            viewBox="0 0 100 40"
          >
            <path
              d="M0,35 Q10,30 20,32 T40,20 T60,25 T80,10 T100,5"
              fill="none"
              stroke="#6764f2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              d="M0,35 Q10,30 20,32 T40,20 T60,25 T80,10 T100,5 V40 H0 Z"
              fill="rgba(103, 100, 242, 0.1)"
              stroke="none"
            />
          </svg>
        </div>
      )}

      {type === 'bookings' && (
        <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-amber-500 h-full rounded-full"
            style={{ width: '65%' }}
          />
        </div>
      )}
    </div>
  );
};

export const StatsGrid = ({ stats }: StatsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  );
};
