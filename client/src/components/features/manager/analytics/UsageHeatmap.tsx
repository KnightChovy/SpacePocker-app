import React from 'react';
import { usageHeatmap } from '@/data/constantManager';

export const UsageHeatmap: React.FC = () => {
  const getIntensity = (val: number) => {
    if (val === 0) return 'bg-gray-100';
    if (val < 4) return 'bg-primary/20';
    if (val < 7) return 'bg-primary/50';
    return 'bg-primary';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-text-dark">Peak Usage Hours</h3>
        <button className="text-gray-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[20px]">
            more_horiz
          </span>
        </button>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar">
        <div className="min-w-100">
          <div className="grid grid-cols-8 gap-1 mb-2">
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider text-center">
              Time
            </div>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div
                key={day}
                className="text-xs font-medium text-center text-text-gray"
              >
                {day}
              </div>
            ))}
          </div>

          {usageHeatmap.map(row => (
            <div key={row.time} className="grid grid-cols-8 gap-1 mb-1">
              <div className="text-[10px] text-gray-400 font-medium flex items-center justify-end pr-2">
                {row.time}
              </div>
              <div
                className={`h-8 rounded ${getIntensity(row.mon)} transition-transform hover:scale-105 cursor-pointer`}
              ></div>
              <div
                className={`h-8 rounded ${getIntensity(row.tue)} transition-transform hover:scale-105 cursor-pointer`}
              ></div>
              <div
                className={`h-8 rounded ${getIntensity(row.wed)} transition-transform hover:scale-105 cursor-pointer`}
              ></div>
              <div
                className={`h-8 rounded ${getIntensity(row.thu)} transition-transform hover:scale-105 cursor-pointer`}
              ></div>
              <div
                className={`h-8 rounded ${getIntensity(row.fri)} transition-transform hover:scale-105 cursor-pointer`}
              ></div>
              <div
                className={`h-8 rounded ${getIntensity(row.sat)} transition-transform hover:scale-105 cursor-pointer`}
              ></div>
              <div
                className={`h-8 rounded ${getIntensity(row.sun)} transition-transform hover:scale-105 cursor-pointer`}
              ></div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4 justify-center text-xs text-gray-500 border-t border-gray-50 pt-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded bg-gray-100"></span> Empty
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded bg-primary/40"></span> Moderate
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded bg-primary"></span> Peak
        </div>
      </div>
    </div>
  );
};
