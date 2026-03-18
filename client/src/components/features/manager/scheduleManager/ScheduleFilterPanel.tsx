import { Calendar } from '@/components/ui/calendar';
import { Zap } from 'lucide-react';

interface FilterPanelProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

export default function ScheduleFilterPanel({
  selectedDate,
  onDateChange,
}: FilterPanelProps) {
  return (
    <div className="hidden xl:flex w-72 flex-col gap-6 overflow-y-auto custom-scrollbar pr-2 pb-10 shrink-0">
      <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-border-light">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateChange}
          className="rounded-lg"
        />
      </div>

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
