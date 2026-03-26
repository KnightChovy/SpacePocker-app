import { Calendar } from '@/components/ui/calendar';

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
    </div>
  );
}
