import React from 'react';
import { ReceiptText, RotateCcw } from 'lucide-react';

const ActionButton: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <button className="px-4 py-2 rounded-xl text-sm font-bold border border-border-light dark:border-border-dark text-text-sub-light dark:text-text-sub-dark hover:text-primary hover:border-primary hover:bg-surface-light dark:hover:bg-surface-dark transition-all flex items-center gap-2">
    <span>
      {icon === 'receipt' && <ReceiptText className='h-5 w-5' />}
      {icon === 'replay' && <RotateCcw className='h-5 w-5' />}
    </span> {label}
  </button>
);

export default ActionButton;