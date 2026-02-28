import { Calendar } from '@/components/ui/calendar';
import type { Building } from '@/types/types';
import { Zap } from 'lucide-react';

interface FilterPanelProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  buildings: Building[];
  onBuildingChange: (buildingId: string, checked: boolean) => void;
  selectedAmenities: string[];
  onAmenityChange: (amenity: string) => void;
}

const AMENITIES = ['Projector', 'Whiteboard', 'Video Conf', 'Sound System'];

export default function ScheduleFilterPanel({
  selectedDate,
  onDateChange,
  buildings,
  onBuildingChange,
  selectedAmenities,
  onAmenityChange,
}: FilterPanelProps) {
  return (
    <div className="hidden xl:flex w-72 flex-col gap-6 overflow-y-auto custom-scrollbar pr-2 pb-10 shrink-0">
      {/* Calendar Card */}
      <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-border-light">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateChange}
          className="rounded-lg"
        />
      </div>

      {/* Building Filters */}
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
          {buildings.map(building => (
            <label
              key={building.id}
              className="group flex items-center gap-3 p-2 rounded-lg hover:bg-white cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={building.checked}
                onChange={e => onBuildingChange(building.id, e.target.checked)}
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

      <div className="h-px bg-border-light w-full" />

      {/* Amenities */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Room Amenities
        </h3>
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map(amenity => (
            <button
              key={amenity}
              onClick={() => onAmenityChange(amenity)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                selectedAmenities.includes(amenity)
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border-light bg-white text-slate-600 hover:border-primary hover:text-primary'
              }`}
            >
              {amenity}
            </button>
          ))}
        </div>
      </div>

      {/* Optimization Card */}
      <div className="mt-auto bg-linear-to-br from-[#0e0d1b] to-[#1c1e31] rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group cursor-pointer">
        <div className="absolute top-0 right-0 h-24 w-24 bg-primary blur-2xl opacity-40 group-hover:opacity-60 transition-opacity" />
        <div className="relative z-10">
          <div className="bg-white/10 w-fit p-2 rounded-lg mb-3 backdrop-blur-sm">
            <Zap className="h-5 w-5 text-yellow-300" />
          </div>
          <h4 className="font-bold text-sm mb-1">Quick Optimization</h4>
          <p className="text-xs text-slate-300 mb-3">
            Optimize space usage with one click.
          </p>
          <span className="text-xs font-bold text-primary-light flex items-center gap-1 group-hover:gap-2 transition-all">
            Run Analysis <span className="text-sm">→</span>
          </span>
        </div>
      </div>
    </div>
  );
}
