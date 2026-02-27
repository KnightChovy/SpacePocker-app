import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  Calendar,
  PieChart,
} from 'lucide-react';
import type { StatSummary } from '@/types/types';

interface StatCardProps {
  stat: StatSummary;
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'payments':
      return <DollarSign className="h-5 w-5" />;
    case 'event_available':
      return <Calendar className="h-5 w-5" />;
    case 'donut_large':
      return <PieChart className="h-5 w-5" />;
    default:
      return <DollarSign className="h-5 w-5" />;
  }
};

const getColorClasses = (color: string) => {
  switch (color) {
    case 'primary':
      return { bg: 'bg-primary/10', text: 'text-primary' };
    case 'accent-orange':
      return { bg: 'bg-orange-100', text: 'text-orange-500' };
    case 'accent-teal':
      return { bg: 'bg-teal-100', text: 'text-teal-500' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-500' };
  }
};

export const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  const { label, value, change, icon, trend, color } = stat;
  const colorClasses = getColorClasses(color);

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`${colorClasses.bg} ${colorClasses.text} p-2.5 rounded-lg`}
        >
          {getIcon(icon)}
        </div>
        <div className={`flex items-center gap-1 ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="text-sm font-medium">{Math.abs(change)}%</span>
        </div>
      </div>
      <p className="text-2xl font-bold text-text-dark mb-1">{value}</p>
      <p className="text-sm text-text-gray">{label}</p>
    </div>
  );
};
