import { Calendar, ChevronDown } from 'lucide-react';
import React from 'react';

export const BookingFilters: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="relative group">
        <select className="appearance-none pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 text-text-dark transition-colors shadow-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none cursor-pointer">
          <option value="">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[18px] text-gray-500 pointer-events-none">
          <ChevronDown />
        </div>
      </div>

      <div className="relative group">
        <select className="appearance-none pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 text-text-dark transition-colors shadow-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none cursor-pointer">
          <option value="">All Buildings</option>
          <option value="science">Science Building</option>
          <option value="arts">Arts Center</option>
          <option value="main">Main Hall</option>
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[18px] text-gray-500 pointer-events-none">
          <ChevronDown />
        </div>
      </div>

      <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 text-text-dark transition-colors shadow-sm">
        <div className="text-[18px] text-gray-500">
          <Calendar />
        </div>
        Select Date Range
      </button>
    </div>
  );
};
