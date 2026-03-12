import React from 'react';
import { BUILDINGS } from '../../../data/constantManager';
export const FilterPanel: React.FC = () => {
  return (
    <div className="hidden xl:flex w-72 flex-col gap-6 overflow-y-auto custom-scrollbar pr-2 pb-10 shrink-0">
      <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-border-light">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1">
            <button className="h-6 w-6 flex items-center justify-center text-slate-400 hover:text-primary rounded hover:bg-slate-50">
              <span className="material-symbols-outlined text-lg">
                chevron_left
              </span>
            </button>
            <button className="h-6 w-6 flex items-center justify-center text-slate-400 hover:text-primary rounded hover:bg-slate-50">
              <span className="material-symbols-outlined text-lg">
                chevron_right
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day} className="text-[10px] font-medium text-slate-400">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          <div className="p-1.5"></div>
          <div className="p-1.5"></div>
          <div className="p-1.5"></div>
          <div className="p-1.5 text-slate-400">1</div>
          {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(d => (
            <div key={d} className="p-1.5 text-slate-900">
              {d}
            </div>
          ))}
          <div className="p-1.5 bg-primary text-white rounded-full shadow-md shadow-primary/30 font-bold">
            14
          </div>
          {[15, 16, 17, 18, 19, 20].map(d => (
            <div key={d} className="p-1.5 text-slate-900">
              {d}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Buildings
          </h3>
          <button className="text-xs text-primary font-medium hover:underline">
            Select All
          </button>
        </div>
        <div className="space-y-1">
          {BUILDINGS.map(building => (
            <label
              key={building.id}
              className="group flex items-center gap-3 p-2 rounded-lg hover:bg-white cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                defaultChecked={building.checked}
                className="rounded border-slate-300 text-primary focus:ring-0 h-4 w-4 cursor-pointer"
              />
              <span className="text-sm text-slate-700 group-hover:text-primary transition-colors">
                {building.name}
              </span>
              <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                {building.count}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-border-light w-full"></div>

      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Room Amenities
        </h3>
        <div className="flex flex-wrap gap-2">
          {['Projector', 'Whiteboard', 'Video Conf', 'Sound System'].map(
            amenity => (
              <button
                key={amenity}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  amenity === 'Whiteboard'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border-light bg-white text-slate-600 hover:border-primary hover:text-primary'
                }`}
              >
                {amenity}
              </button>
            )
          )}
        </div>
      </div>

      <div className="mt-auto bg-linear-to-br from-[#0e0d1b] to-[#1c1e31] rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group cursor-pointer">
        <div className="absolute top-0 right-0 h-24 w-24 bg-primary blur-2xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
        <div className="relative z-10">
          <div className="bg-white/10 w-fit p-2 rounded-lg mb-3 backdrop-blur-sm">
            <span className="material-symbols-outlined text-yellow-300">
              bolt
            </span>
          </div>
          <h4 className="font-bold text-sm mb-1">Quick Optimization</h4>
          <p className="text-xs text-slate-300 mb-3">
            Optimize space usage with one click.
          </p>
          <span className="text-xs font-bold text-primary-light flex items-center gap-1 group-hover:gap-2 transition-all">
            Run Analysis{' '}
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
