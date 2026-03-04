import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Bell, MessageSquare, Calendar } from 'lucide-react';
import AppHeader from '@/components/layouts/AppHeader';
import { StatCard } from '@/components/common/StatCard';
import { RevenueChart } from '@/components/features/manager/analytics/RevenueChart';
import { UsageHeatmap } from '@/components/features/manager/analytics/UsageHeatmap';
import { TopRoomsTable } from '@/components/features/manager/analytics/TopRoomTable';
import { statsData } from '@/data/constantManager';
import type { TimeRange } from '@/types/types';

export const AnalyticsPage: React.FC = () => {
  const { setSidebarOpen } = useOutletContext<{
    setSidebarOpen: (open: boolean) => void;
  }>();
  const [range, setRange] = useState<TimeRange>('30days');

  const headerActions = [
    {
      id: 'date-range',
      icon: <Calendar className="h-5 w-5" />,
      label: '30 Days',
      variant: 'ghost' as const,
    },
    {
      id: 'notifications',
      icon: <Bell className="h-5 w-5" />,
      badge: true,
    },
    {
      id: 'messages',
      icon: <MessageSquare className="h-5 w-5" />,
    },
  ];

  return (
    <>
      <AppHeader
        title="Analytics & Reporting"
        subtitle="Detailed insights into revenue, occupancy, and room performance."
        onMenuClick={() => setSidebarOpen(true)}
        actions={headerActions}
        profile={{
          name: 'Alex Morgan',
          subtitle: 'Manager',
          avatarUrl: 'https://picsum.photos/id/64/100/100',
          showDropdown: true,
        }}
      />
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8 custom-scrollbar">
        <div className="max-w-350 mx-auto w-full">
          <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setRange('30days')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                range === '30days'
                  ? 'bg-gray-100 text-text-dark shadow-sm'
                  : 'text-gray-500 hover:text-text-dark'
              }`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => setRange('quarter')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                range === 'quarter'
                  ? 'bg-gray-100 text-text-dark shadow-sm'
                  : 'text-gray-500 hover:text-text-dark'
              }`}
            >
              Quarter
            </button>
            <button
              onClick={() => setRange('year')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                range === 'year'
                  ? 'bg-gray-100 text-text-dark shadow-sm'
                  : 'text-gray-500 hover:text-text-dark'
              }`}
            >
              Year
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statsData.map((stat, idx) => (
            <StatCard key={idx} stat={stat} />
          ))}
        </div>

        <RevenueChart />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
          <UsageHeatmap />
          <TopRoomsTable />
        </div>
      </div>
    </>
  );
};
