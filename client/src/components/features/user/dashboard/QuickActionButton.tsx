import React from 'react';
import { MapPinPlus, ReceiptText, Star, Map } from 'lucide-react';

const QuickActionButton: React.FC<{
  icon: string;
  label: string;
  color: string;
}> = ({ icon, label, color }) => (
  <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-surface-light dark:bg-surface-dark shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-primary/20">
    <span className={` text-3xl ${color}`}>
      {icon === 'location' && <MapPinPlus />}
      {icon === 'receipt' && <ReceiptText />}
      {icon === 'star' && <Star />}
      {icon === 'map' && <Map />}
    </span>
    <span className="text-xs font-bold text-center">{label}</span>
  </button>
);

export default QuickActionButton;
