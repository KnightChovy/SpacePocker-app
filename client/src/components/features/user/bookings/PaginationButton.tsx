import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PaginationButton: React.FC<{
  icon?: string;
  label?: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}> = ({ icon, label, active, disabled, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-colors ${
      active
        ? 'bg-primary border-primary text-white font-bold shadow-md shadow-primary/20'
        : 'border-border-light dark:border-border-dark text-text-sub-light hover:bg-surface-light dark:hover:bg-surface-dark hover:text-primary'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {icon ? (
      <span>
        {icon === 'left' ? (
          <ChevronLeft className="h-5 w-5" />
        ) : (
          <ChevronRight className="h-5 w-5" />
        )}
      </span>
    ) : (
      label
    )}
  </button>
);

export default PaginationButton;
