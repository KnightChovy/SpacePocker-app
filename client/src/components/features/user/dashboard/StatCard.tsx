import React from 'react';
import { CalendarCheck, CreditCard, Timer, MoveUp } from 'lucide-react';

const StatCard: React.FC<{
  icon: string;
  title: string;
  value: string;
  trend?: string;
  topUp?: boolean;
  colorClass: string;
}> = ({ icon, title, value, trend, topUp, colorClass }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    purple:
      'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    amber:
      'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
  }[colorClass as 'blue' | 'purple' | 'amber'];

  return (
    <div className="group bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
      <div className="absolute -right-5 -top-5 opacity-5 transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500">
        <span className=" text-[140px]">
          {icon === 'event' && <CalendarCheck />}
          {icon === 'timer' && <Timer />}
          {icon === 'payments' && <CreditCard />}
        </span>
      </div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-xl ${colors}`}>
            {icon === 'event' && <CalendarCheck />}
            {icon === 'timer' && <Timer />}
            {icon === 'payments' && <CreditCard />}
          </div>
          {trend && (
            <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full flex items-center gap-1">
              <MoveUp className="h-4" /> {trend}
            </span>
          )}
          {topUp && (
            <button className="text-xs font-bold text-primary hover:text-primary-dark underline">
              Top Up
            </button>
          )}
        </div>
        <p className="text-text-sub-light dark:text-text-sub-dark text-sm font-medium mb-1">
          {title}
        </p>
        <h3 className="text-3xl font-bold">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
