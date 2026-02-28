import React, { useState } from 'react';
import { DollarSign, Building2, UserPlus, Server } from 'lucide-react';
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';
import StatCard from '../../components/admin/StatCard';
import TransactionChart from '../../components/admin/TransactionChart';
import UserAcquisitionChart from '../../components/admin/UserAcquisitionChart';
import SystemHealth from '../../components/admin/SystemHealth';
import TransactionTable from '../../components/admin/TransactionTable';
import type { Stat, Transaction, LogEntry } from '../../types/admin-types';
import dashboardData from '../../data/admin-dashboard.json';

const iconMap = {
  DollarSign,
  Building2,
  UserPlus,
  Server,
};

const DashboardPage: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('dashboard');
  const [isOpen, setIsOpen] = useState<boolean>(true);
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
    <div className="flex h-screen bg-[#f8f9fc] overflow-hidden">
      <Sidebar
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8">
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
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
