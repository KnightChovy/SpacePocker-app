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

const AdminDashboardPage: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('dashboard');
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [stats] = useState<Stat[]>([
    {
      label: 'Total Revenue',
      value: '$124,500',
      trend: '12%',
      trendType: 'up',
      icon: DollarSign,
    },
    {
      label: 'Active Spaces',
      value: '842',
      trend: '5%',
      trendType: 'up',
      icon: Building2,
    },
    {
      label: 'New Hosts',
      value: '45',
      trend: '8%',
      trendType: 'up',
      icon: UserPlus,
    },
    {
      label: 'System Uptime',
      value: '99.9%',
      trend: '0.1%',
      trendType: 'up',
      icon: Server,
    },
  ]);

  const [transactions] = useState<Transaction[]>([
    {
      id: '#TRX-99281',
      userName: 'Sarah Wilson',
      userAvatar: 'https://picsum.photos/seed/sarah/100/100',
      spaceName: 'Creative Loft Downtown',
      date: 'Oct 24, 2023',
      amount: 450,
      status: 'Completed',
    },
    {
      id: '#TRX-99280',
      userName: 'James Rodriguez',
      userAvatar: 'https://picsum.photos/seed/james/100/100',
      spaceName: 'Conference Room B',
      date: 'Oct 24, 2023',
      amount: 120,
      status: 'Pending',
    },
    {
      id: '#TRX-99279',
      userName: 'Elena Li',
      userAvatar: 'https://picsum.photos/seed/elena/100/100',
      spaceName: 'Podcast Studio',
      date: 'Oct 23, 2023',
      amount: 85,
      status: 'Completed',
    },
    {
      id: '#TRX-99278',
      userName: 'Robert Fox',
      userAvatar: 'https://picsum.photos/seed/robert/100/100',
      spaceName: 'Open Coworking Deck',
      date: 'Oct 22, 2023',
      amount: 210,
      status: 'Completed',
    },
  ]);

  const [logs] = useState<LogEntry[]>([
    {
      timestamp: '10:42:05',
      message: 'Payment Gateway Latency < 200ms',
      type: 'success',
    },
    {
      timestamp: '10:41:52',
      message: 'New User Registration: user_8829',
      type: 'info',
    },
    {
      timestamp: '10:35:10',
      message: 'Database backup completed',
      type: 'success',
    },
    {
      timestamp: '10:15:22',
      message: '404 Error - /api/spaces/12 - Rate Limit',
      type: 'error',
    },
    {
      timestamp: '10:02:01',
      message: 'Server load normalized (42%)',
      type: 'info',
    },
  ]);

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
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <StatCard key={idx} {...stat} />
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TransactionChart />
            </div>
            <div className="flex flex-col gap-8">
              <UserAcquisitionChart />
              <SystemHealth logs={logs} />
            </div>
          </div>

          {/* Transactions Table */}
          <TransactionTable transactions={transactions} />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
