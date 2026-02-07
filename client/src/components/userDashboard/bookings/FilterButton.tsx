import React from 'react';
import { Building2, Calendar, ChevronDown } from 'lucide-react';

const FilterButton: React.FC<{ icon: string; label: string }> = ({
  icon,
  label,
}) => (
  <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark hover:border-primary/50 transition-all shadow-sm whitespace-nowrap">
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

export default FilterButton;
