import React, { useState, useEffect } from 'react';
import AppSidebar from '../../components/admin/Sidebar';
import SummaryCard from '../../components/admin/SummaryCard';
import TransactionList from '../../components/admin/TransactionList';
import type { StatData, PaymentTransaction } from '@/types/admin-types';
import { TransactionStatus, PayoutStatus } from '@/types/admin-types';

// AI Insights helper function
const getAIInsights = async (
  transactions: PaymentTransaction[]
): Promise<string> => {
  // Simulate AI analysis
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const successRate =
    (transactions.filter(t => t.status === 'Succeeded').length /
      transactions.length) *
    100;
  return `Based on ${transactions.length} recent transactions totaling $${totalAmount.toLocaleString()}, your platform shows a ${successRate.toFixed(1)}% success rate. Revenue is trending positively with strong user engagement.`;
};

const MOCK_STATS: StatData[] = [
  {
    label: 'Gross Volume',
    value: '$482,900.00',
    trend: '18.2%',
    trendDirection: 'up',
    icon: 'payments',
    iconBg: 'bg-indigo-50 dark:bg-indigo-500/10',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    label: 'Net Revenue (Fee)',
    value: '$48,290.00',
    trend: '21%',
    trendDirection: 'up',
    icon: 'monetization_on',
    iconBg: 'bg-teal-50 dark:bg-teal-500/10',
    iconColor: 'text-teal-600 dark:text-teal-400',
  },
  {
    label: 'Payouts Pending',
    value: '$12,450.00',
    trend: '0%',
    trendDirection: 'neutral',
    icon: 'pending',
    iconBg: 'bg-orange-50 dark:bg-orange-500/10',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
  {
    label: 'Refund Rate',
    value: '1.2%',
    trend: '0.5%',
    trendDirection: 'down',
    icon: 'replay',
    iconBg: 'bg-rose-50 dark:bg-rose-500/10',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
];

const MOCK_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: '#TRX-99281',
    user: {
      id: 'u1',
      name: 'Sarah Wilson',
      role: 'Renter',
      avatar: 'https://picsum.photos/seed/sarah/100/100',
    },
    date: 'Oct 24, 2023',
    time: '14:20',
    amount: 450.0,
    fee: 45.0,
    status: TransactionStatus.SUCCEEDED,
    payoutStatus: PayoutStatus.PAID,
  },
  {
    id: '#TRX-99280',
    user: {
      id: 'u2',
      name: 'James Rodriguez',
      role: 'Renter',
      avatar: 'https://picsum.photos/seed/james/100/100',
    },
    date: 'Oct 24, 2023',
    time: '11:05',
    amount: 120.0,
    fee: 12.0,
    status: TransactionStatus.SUCCEEDED,
    payoutStatus: PayoutStatus.SCHEDULED,
  },
  {
    id: '#TRX-99279',
    user: {
      id: 'u3',
      name: 'Elena Li',
      role: 'Host',
      avatar: 'https://picsum.photos/seed/elena/100/100',
    },
    date: 'Oct 23, 2023',
    time: '16:45',
    amount: 85.0,
    fee: 8.5,
    status: TransactionStatus.SUCCEEDED,
    payoutStatus: PayoutStatus.PAID,
  },
  {
    id: '#TRX-99278',
    user: {
      id: 'u4',
      name: 'Michael Jordan',
      role: 'Renter',
      avatar: 'https://picsum.photos/seed/michael/100/100',
    },
    date: 'Oct 23, 2023',
    time: '09:12',
    amount: 320.0,
    fee: 0.0,
    status: TransactionStatus.REFUNDED,
    payoutStatus: PayoutStatus.CANCELLED,
  },
  {
    id: '#TRX-99277',
    user: {
      id: 'u5',
      name: 'Anna Klein',
      role: 'Host',
      avatar: 'https://picsum.photos/seed/anna/100/100',
    },
    date: 'Oct 22, 2023',
    time: '18:30',
    amount: 1200.0,
    fee: 120.0,
    status: TransactionStatus.SUCCEEDED,
    payoutStatus: PayoutStatus.PROCESSING,
  },
];

const AdminFinancialPage: React.FC = () => {
  const [activeItem, setActiveItem] = useState('finance');
  const [isOpen, setIsOpen] = useState(false);
  const [aiInsight, setAiInsight] = useState<string>(
    'Generating AI summary...'
  );

  useEffect(() => {
    const fetchInsights = async () => {
      const insight = await getAIInsights(MOCK_TRANSACTIONS);
      setAiInsight(insight || 'No insights available.');
    };
    fetchInsights();
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark transition-colors duration-200">
      {/* Sidebar Component */}
      <AppSidebar
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Header Section */}
        <header className="absolute top-0 left-0 right-0 z-10 px-6 py-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 text-gray-500 hover:text-indigo-500 rounded-lg">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                Financial Overview
              </h2>
              <p className="text-sm text-gray-400 dark:text-gray-500 hidden sm:block">
                Track gross volume, net revenue, and transaction history.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden md:flex items-center h-10 bg-white dark:bg-gray-800 rounded-lg px-3 border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all w-64 shadow-sm">
              <span className="material-symbols-outlined text-gray-400">
                search
              </span>
              <input
                className="bg-transparent border-none focus:ring-0 text-sm w-full text-gray-700 dark:text-gray-200 placeholder-gray-400"
                placeholder="Search transactions..."
                type="text"
              />
              <span className="text-xs text-gray-400 border border-gray-200 dark:border-gray-600 rounded px-1.5 py-0.5">
                ⌘K
              </span>
            </div>

            <button className="flex items-center gap-2 h-10 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <span className="material-symbols-outlined text-[18px] text-gray-400">
                calendar_today
              </span>
              <span className="hidden sm:inline">This Month</span>
              <span className="material-symbols-outlined text-[18px] text-gray-400">
                expand_more
              </span>
            </button>

            <button className="flex items-center justify-center h-10 w-10 sm:w-auto sm:px-4 bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-500/30 hover:bg-indigo-600 transition-all">
              <span className="material-symbols-outlined text-[20px]">
                download
              </span>
              <span className="hidden sm:inline ml-2 text-sm font-semibold">
                Export Report
              </span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden pt-22 pb-8 px-6 md:px-8 bg-background-light dark:bg-background-dark">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            {/* AI Insight Notification */}
            <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex items-start gap-4">
              <div className="p-2 bg-indigo-500 text-white rounded-xl">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  AI Financial Insights
                </h4>
                <p className="text-sm text-indigo-700/70 dark:text-indigo-300/60 mt-1 leading-relaxed italic">
                  "{aiInsight}"
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {MOCK_STATS.map(stat => (
                <SummaryCard key={stat.label} {...stat} />
              ))}
            </div>

            {/* Transaction Table Section */}
            <TransactionList transactions={MOCK_TRANSACTIONS} />

            <footer className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500 pb-4">
              <p>
                © 2023 SPACEPOCKER Inc. All rights reserved.{' '}
                <a className="hover:text-indigo-500 ml-2" href="#">
                  Financial Policy
                </a>
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminFinancialPage;
