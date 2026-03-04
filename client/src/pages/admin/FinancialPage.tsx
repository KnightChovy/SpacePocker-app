import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import AppHeader from '@/components/layouts/AppHeader';
import SummaryCard from '@/components/features/admin/SummaryCard';
import TransactionList from '@/components/features/admin/TransactionList';
import type { StatData, PaymentTransaction } from '@/types/admin-types';
import { TransactionStatus, PayoutStatus } from '@/types/admin-types';
import financialData from '@/data/admin-financial.json';

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
  const { setSidebarOpen } = useOutletContext<{ setSidebarOpen: (open: boolean) => void }>();
  const [aiInsight, setAiInsight] = useState<string>(
    'Generating AI summary...'
  );

  const headerActions = [
    {
      id: 'date-range',
      icon: <span className="material-symbols-outlined text-[20px]">calendar_today</span>,
      label: 'Last 30 Days',
      variant: 'ghost' as const,
    },
    {
      id: 'export',
      icon: <span className="material-symbols-outlined text-[20px]">file_download</span>,
      label: 'Export Report',
      variant: 'primary' as const,
    },
  ];

  useEffect(() => {
    const fetchInsights = async () => {
      const insight = await getAIInsights(MOCK_TRANSACTIONS);
      setAiInsight(insight || 'No insights available.');
    };
    fetchInsights();
  }, []);

  return (
    <>
      <AppHeader
        title="Financial Overview"
        subtitle="Track gross volume, net revenue, and transaction history."
        onMenuClick={() => setSidebarOpen(true)}
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
    </>
  );
};

export default FinancialPage;
