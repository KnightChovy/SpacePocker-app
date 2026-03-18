import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DollarSign, Building2, UserPlus, Server } from 'lucide-react';
import AppHeader from '@/components/layouts/AppHeader';
import StatCard from '@/components/features/admin/StatCard';
import TransactionChart from '@/components/features/admin/TransactionChart';
import SystemHealth from '@/components/features/admin/SystemHealth';
import TransactionTable from '@/components/features/admin/TransactionTable';
import type { Stat, Transaction, LogEntry } from '@/types/admin-types';
import { useAuthStore } from '@/stores/auth.store';
import { getAvatarUrl } from '@/lib/utils';
import { useAdminDashboard } from '@/hooks/admin/dashboard/use-admin-dashboard';

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
  const user = useAuthStore(state => state.user);
  const { data, isLoading, isError } = useAdminDashboard();
  console.log(data);


  const stats = useMemo<Stat[]>(() => {
    return (
      data?.stats.map(stat => ({
        ...stat,
        icon: iconMap[stat.icon as keyof typeof iconMap],
      })) ?? []
    );
  }, [data?.stats]);

  const transactions = useMemo<Transaction[]>(() => {
    return data?.transactions ?? [];
  }, [data?.transactions]);

  const logs = useMemo<LogEntry[]>(() => {
    return data?.logs ?? [];
  }, [data?.logs]);

  return (
    <>
      <AppHeader
        title="Analytics Overview"
        subtitle="Real-time insights for SPACEPOCKER performance."
        onMenuClick={() => setSidebarOpen(true)}
        showSearch={false}
        searchPlaceholder="Search analytics..."
        profile={{
          name: user?.name || 'Admin',
          subtitle: user?.role || 'ADMIN',
          avatarUrl: getAvatarUrl(user?.name, 'Admin'),
          showDropdown: true,
        }}
        iconType="material"
      />
      <main className="flex-1 overflow-y-auto p-6 lg:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {isError ? (
            <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl px-4 py-3 text-sm">
              Failed to load dashboard data from API.
            </div>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(isLoading ? [] : stats).map((stat, idx) => (
              <StatCard key={idx} {...stat} />
            ))}
            {isLoading ? (
              <div className="col-span-full bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-sm text-gray-500">
                Loading dashboard metrics...
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TransactionChart data={data?.transactionChart ?? []} />
            </div>
            <div className="flex flex-col gap-8">
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
