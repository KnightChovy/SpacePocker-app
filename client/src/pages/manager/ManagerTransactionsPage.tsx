import React, { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import AppHeader from '@/components/layouts/AppHeader';
import { useAuthStore } from '@/stores/auth.store';
import { getAvatarUrl } from '@/lib/utils';
import {
  transactionService,
  type TransactionItem,
  type TransactionStatus,
  type TransactionPaymentMethod,
} from '@/services/transactionService';
import { toast } from 'react-toastify';
import { getApiErrorMessage } from '@/lib/utils';

const statusOptions: Array<{ label: string; value?: TransactionStatus }> = [
  { label: 'All Statuses', value: undefined },
  { label: 'SUCCESS', value: 'SUCCESS' },
  { label: 'PENDING', value: 'PENDING' },
  { label: 'FAILED', value: 'FAILED' },
  { label: 'REFUNDED', value: 'REFUNDED' },
];

const paymentMethodOptions: Array<{
  label: string;
  value?: TransactionPaymentMethod;
}> = [
  { label: 'All Methods', value: undefined },
  { label: 'VNPAY', value: 'VNPAY' },
  { label: 'CASH', value: 'CASH' },
  { label: 'BANK_TRANSFER', value: 'BANK_TRANSFER' },
];

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const ManagerTransactionsPage: React.FC = () => {
  const { setSidebarOpen } = useOutletContext<{
    setSidebarOpen: (open: boolean) => void;
  }>();
  const user = useAuthStore(state => state.user);

  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [status, setStatus] = useState<TransactionStatus | undefined>();
  const [paymentMethod, setPaymentMethod] = useState<
    TransactionPaymentMethod | undefined
  >();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        const result = await transactionService.getAllTransactions({
          page,
          limit,
          status,
          paymentMethod,
        });

        setTransactions(result.data ?? []);
        setTotal(result.total ?? 0);
      } catch (error) {
        setIsError(true);
        console.error('Failed to fetch transactions:', error);
        toast.error(getApiErrorMessage(error, 'Failed to load transactions'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [page, limit, status, paymentMethod]);

  const totalPages = useMemo(() => {
    if (!total) return 1;
    return Math.max(1, Math.ceil(total / limit));
  }, [total, limit]);

  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  return (
    <>
      <AppHeader
        title="Transactions"
        subtitle="Track payments for your managed rooms."
        onMenuClick={() => setSidebarOpen(true)}
        profile={{
          name: user?.name || 'Manager',
          subtitle: user?.role || 'MANAGER',
          avatarUrl: getAvatarUrl(user?.name, 'Manager'),
          showDropdown: true,
        }}
      />
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8 custom-scrollbar relative">
        <div className="max-w-350 mx-auto w-full pb-10 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <select
              className="form-select bg-transparent text-sm border-gray-200 rounded-lg text-gray-600 focus:ring-0 focus:border-primary h-10 py-1 pl-3 pr-8 cursor-pointer"
              value={status ?? ''}
              onChange={e => {
                setStatus(
                  (e.target.value || undefined) as TransactionStatus | undefined
                );
                setPage(1);
              }}
            >
              {statusOptions.map(option => (
                <option key={option.label} value={option.value ?? ''}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              className="form-select bg-transparent text-sm border-gray-200 rounded-lg text-gray-600 focus:ring-0 focus:border-primary h-10 py-1 pl-3 pr-8 cursor-pointer"
              value={paymentMethod ?? ''}
              onChange={e => {
                setPaymentMethod(
                  (e.target.value || undefined) as
                    | TransactionPaymentMethod
                    | undefined
                );
                setPage(1);
              }}
            >
              {paymentMethodOptions.map(option => (
                <option key={option.label} value={option.value ?? ''}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-2xl shadow-float border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 text-sm text-slate-500">
              {isLoading
                ? 'Loading transactions...'
                : isError
                  ? 'Failed to load transactions'
                  : `Showing ${transactions.length} / ${total} transactions`}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-200">
                <thead>
                  <tr className="bg-gray-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-gray-200">
                    <th className="py-4 px-4">Transaction ID</th>
                    <th className="py-4 px-4">User</th>
                    <th className="py-4 px-4">Room</th>
                    <th className="py-4 px-4">Amount</th>
                    <th className="py-4 px-4">Method</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isError ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-10 px-6 text-center text-sm text-red-600"
                      >
                        Failed to load transactions. Please try again.
                      </td>
                    </tr>
                  ) : null}

                  {!isLoading && !isError && transactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-10 px-6 text-center text-sm text-gray-500"
                      >
                        No transactions found.
                      </td>
                    </tr>
                  ) : null}

                  {transactions.map(transaction => (
                    <tr
                      key={transaction.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4 text-sm font-mono text-gray-700">
                        {transaction.id}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        {transaction.user?.name ?? transaction.userId}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        {transaction.booking?.room?.name ?? '-'}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900 font-semibold">
                        {currencyFormatter.format(transaction.amount)}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        {transaction.paymentMethod}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        {transaction.status}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-white">
              <button
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-50"
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={!canGoPrev || isLoading}
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} / {totalPages}
              </span>
              <button
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-50"
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                disabled={!canGoNext || isLoading}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManagerTransactionsPage;
