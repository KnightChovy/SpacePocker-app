import React from 'react';
import { Building2, Calendar, ChevronDown } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type FilterButtonProps = {
  icon: 'calendar' | 'domain';
  label: string;
  isActive?: boolean;
  contentClassName?: string;
  children?: React.ReactNode;
};

const FilterButton: React.FC<FilterButtonProps> = ({
  icon,
  label,
  isActive = false,
  contentClassName,
  children,
}) => {
  const trigger = (
    <button
      type="button"
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border bg-surface-light dark:bg-surface-dark hover:border-primary/50 transition-all shadow-sm whitespace-nowrap ${
        isActive
          ? 'border-primary/60 text-primary'
          : 'border-border-light dark:border-border-dark'
      }`}
    >
      <span className="text-text-sub-light">
        {icon === 'calendar' && <Calendar className="w-5 h-5" />}
        {icon === 'domain' && <Building2 className="w-5 h-5" />}
      </span>
      <span className="text-sm font-medium">{label}</span>
      <span className="text-text-sub-light ml-1">
        <ChevronDown className="w-4 h-4" />
      </span>
    </button>
  );

  if (!children) return trigger;

  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align="end"
        className={`w-72 p-3 ${contentClassName ?? ''}`.trim()}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
};

export default FilterButton;
