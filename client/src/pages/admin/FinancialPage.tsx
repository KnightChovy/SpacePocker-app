import React, { useState, useEffect } from 'react';
import AppSidebar from '../../components/admin/Sidebar';
import SummaryCard from '../../components/admin/SummaryCard';
import TransactionList from '../../components/admin/TransactionList';
import type { StatData, PaymentTransaction } from '@/types/admin-types';
import { TransactionStatus, PayoutStatus } from '@/types/admin-types';
import financialData from '../../data/admin-financial.json';

const getAIInsights = async (
  transactions: PaymentTransaction[]
): Promise<string> => {
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const successRate =
    (transactions.filter(t => t.status === 'Succeeded').length /
      transactions.length) *
    100;
  return `Based on ${transactions.length} recent transactions totaling $${totalAmount.toLocaleString()}, your platform shows a ${successRate.toFixed(1)}% success rate. Revenue is trending positively with strong user engagement.`;
};

const MOCK_STATS: StatData[] = financialData.stats.map(stat => ({
  ...stat,
  trendDirection: stat.trendDirection as 'up' | 'down' | 'neutral',
}));

const MOCK_TRANSACTIONS: PaymentTransaction[] = financialData.transactions.map(
  tx => ({
    ...tx,
    status:
      TransactionStatus[
        tx.status.toUpperCase() as keyof typeof TransactionStatus
      ],
    payoutStatus:
      PayoutStatus[tx.payoutStatus.toUpperCase() as keyof typeof PayoutStatus],
  })
);

const FinancialPage: React.FC = () => {
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
      <AppSidebar
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
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

        <main className="flex-1 overflow-y-auto overflow-x-hidden pt-22 pb-8 px-6 md:px-8 bg-background-light dark:bg-background-dark">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {MOCK_STATS.map(stat => (
                <SummaryCard key={stat.label} {...stat} />
              ))}
            </div>

            <TransactionList transactions={MOCK_TRANSACTIONS} />

            <footer className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500 pb-4">
              <p>
                © {new Date().getFullYear()} SPACEPOCKER Inc. All rights
                reserved.{' '}
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

export default FinancialPage;
