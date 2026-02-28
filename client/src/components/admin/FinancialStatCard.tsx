import React from 'react';
import type { StatData } from '../../types/admin-types';

const FinancialStatCard: React.FC<StatData> = ({
  label,
  value,
  trend,
  trendDirection,
  icon,
  iconBg,
  iconColor,
}) => {
  return (
    <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-float border border-gray-100 dark:border-gray-700/50 flex flex-col gap-1 transition-transform hover:-translate-y-1 duration-300">
      <div className="flex justify-between items-start">
        <div className={`p-2 ${iconBg} rounded-lg ${iconColor}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <span
          className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
            trendDirection === 'up'
              ? 'text-teal-600 bg-teal-50 dark:bg-teal-500/10'
              : trendDirection === 'down'
                ? 'text-rose-600 bg-rose-50 dark:bg-rose-500/10'
                : 'text-gray-500 bg-gray-100 dark:bg-gray-800'
          }`}
        >
          <span className="material-symbols-outlined text-[14px] mr-1">
            {trendDirection === 'up'
              ? 'trending_up'
              : trendDirection === 'down'
                ? 'trending_down'
                : 'remove'}
          </span>
          {trend}
        </span>
      </div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">
        {label}
      </p>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
        {value}
      </h3>
    </div>
  );
};

export default FinancialStatCard;
