import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DollarSign, Building2, UserPlus, Server } from 'lucide-react';
import AppHeader from '@/components/layouts/AppHeader';
import StatCard from '@/components/features/admin/StatCard';
import TransactionChart from '@/components/features/admin/TransactionChart';
import UserAcquisitionChart from '@/components/features/admin/UserAcquisitionChart';
import SystemHealth from '@/components/features/admin/SystemHealth';
import TransactionTable from '@/components/features/admin/TransactionTable';
import type { Stat, Transaction, LogEntry } from '@/types/admin-types';
import dashboardData from '@/data/admin-dashboard.json';

const iconMap = {
  DollarSign,
  Building2,
  UserPlus,
  Server,
};

const DashboardPage: React.FC = () => {
  const { setSidebarOpen } = useOutletContext<{
    setSidebarOpen: (open: boolean) => void;
  }>();

  const headerActions = [
    {
      id: 'date-range',
      icon: (
        <span className="material-symbols-outlined text-[20px]">
          calendar_today
        </span>
      ),
      label: 'Last 30 Days',
      variant: 'ghost' as const,
    },
    {
      id: 'export',
      icon: (
        <span className="material-symbols-outlined text-[20px]">
          file_download
        </span>
      ),
      label: 'Export',
      variant: 'primary' as const,
    },
  ];

  const [stats] = useState<Stat[]>(
    dashboardData.stats.map(stat => ({
      ...stat,
      icon: iconMap[stat.icon as keyof typeof iconMap],
      trendType: stat.trendType as 'up' | 'down',
    }))
  );

  const [transactions] = useState<Transaction[]>(
    dashboardData.transactions.map(tx => ({
      ...tx,
      status: tx.status as 'Completed' | 'Pending' | 'Failed',
    }))
  );

  const [logs] = useState<LogEntry[]>(
    dashboardData.logs.map(log => ({
      ...log,
      type: log.type as 'success' | 'info' | 'error' | 'warning',
    }))
  );

  return (
    <>
      <AppHeader
        title="Analytics Overview"
        subtitle="Real-time insights for SPACEPOCKER performance."
        onMenuClick={() => setSidebarOpen(true)}
        showSearch={true}
        searchPlaceholder="Search analytics..."
        actions={headerActions}
        profile={{
          name: 'Admin',
          subtitle: 'Administrator',
          avatarUrl: 'https://picsum.photos/seed/marcus/100/100',
          showDropdown: true,
        }}
        iconType="material"
      />
      <main className="flex-1 overflow-y-auto p-6 lg:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <StatCard key={idx} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TransactionChart />
            </div>
            <div className="flex flex-col gap-8">
              <UserAcquisitionChart />
              <SystemHealth logs={logs} />
            </div>
          </div>

          <TransactionTable transactions={transactions} />
        </div>
      </main>
    </>
  );
};

export default DashboardPage;
