import React from 'react';
import { TrendingUp } from 'lucide-react';
import type { Stat } from '../../types/admin-types';

const StatCard: React.FC<Stat> = ({ label, value, trend, icon: Icon }) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div
          className={`p-3 rounded-2xl bg-opacity-10 group-hover:scale-110 transition-transform duration-300 ${
            label === 'Total Revenue'
              ? 'bg-indigo-600 text-indigo-600'
              : label === 'Active Spaces'
                ? 'bg-purple-600 text-purple-600'
                : label === 'New Hosts'
                  ? 'bg-blue-600 text-blue-600'
                  : 'bg-emerald-600 text-emerald-600'
          }`}
        >
          <Icon size={24} />
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full">
          <TrendingUp size={14} className="text-emerald-600" />
          <span className="text-[13px] font-bold text-emerald-600 tracking-tight">
            {trend}
          </span>
        </div>
      </div>
      <div className="mt-5">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <h3 className="text-3xl font-bold text-gray-900 mt-1 tracking-tight">
          {value}
        </h3>
      </div>
    </div>
  );
};

export default StatCard;
