import React from 'react';
import type { InventoryStats } from '@/types/admin-types';

interface StatsSectionProps {
  stats: InventoryStats;
}

const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <StatCard
        icon="domain"
        label="All Listings"
        value={stats.total}
        badge="Total"
        badgeColor="bg-teal-50 text-secondary"
        iconColor="text-primary bg-indigo-50"
      />
      <StatCard
        icon="pending_actions"
        label="Pending Review"
        value={stats.pending}
        badge="Action Required"
        badgeColor="bg-yellow-50 text-yellow-600"
        iconColor="text-yellow-600 bg-yellow-50"
        highlight={true}
      />
      <StatCard
        icon="verified"
        label="Approved & Active"
        value={stats.approved}
        badge="Live"
        badgeColor="bg-green-50 text-green-600"
        iconColor="text-green-600 bg-green-50"
      />
      <StatCard
        icon="block"
        label="Rejected/Inactive"
        value={stats.rejected}
        badge="Archive"
        badgeColor="bg-gray-50 text-text-secondary"
        iconColor="text-red-600 bg-red-50"
      />
    </div>
  );
};

interface StatCardProps {
  icon: string;
  label: string;
  value: number;
  badge: string;
  badgeColor: string;
  iconColor: string;
  highlight?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  badge,
  badgeColor,
  iconColor,
  highlight,
}) => (
  <div
    className={`bg-white p-5 rounded-2xl shadow-float border border-gray-100 flex flex-col gap-1 transition-all hover:-translate-y-1 duration-300 ${highlight ? 'ring-2 ring-yellow-500/20' : ''}`}
  >
    <div className="flex justify-between items-start">
      <div className={`p-2 rounded-lg ${iconColor}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <span
        className={`flex items-center text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tight ${badgeColor}`}
      >
        {badge}
      </span>
    </div>
    <p className="text-sm font-medium text-text-secondary mt-2">{label}</p>
    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h3>
  </div>
);

export default StatsSection;
