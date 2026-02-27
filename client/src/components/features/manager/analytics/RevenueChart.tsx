import React from 'react';
import { revenueData } from '@/data/constantManager';

export const RevenueChart: React.FC = () => {
  const maxValue = Math.max(...revenueData.map(d => d.value));

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-text-dark">Revenue Overview</h3>
        <button className="text-gray-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[20px]">
            more_horiz
          </span>
        </button>
      </div>

      <div className="flex-1 flex items-end gap-2 min-h-50">
        {revenueData.map(item => {
          const heightPercent = (item.value / maxValue) * 100;
          return (
            <div
              key={item.name}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <div className="w-full flex justify-center">
                <span className="text-xs font-medium text-text-gray">
                  ${(item.value / 1000).toFixed(0)}k
                </span>
              </div>
              <div
                className="w-full bg-primary/80 rounded-t-md transition-all hover:bg-primary cursor-pointer"
                style={{ height: `${heightPercent}%`, minHeight: '20px' }}
              />
              <span className="text-xs text-gray-500">{item.name}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4">
        <div className="text-sm text-gray-500">
          Total:{' '}
          <span className="font-semibold text-text-dark">
            ${revenueData.reduce((sum, d) => sum + d.value, 0).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-green-600">
          <span className="material-symbols-outlined text-[16px]">
            trending_up
          </span>
          +12.5% vs last period
        </div>
      </div>
    </div>
  );
};
