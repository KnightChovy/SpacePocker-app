import React from 'react';
import {
  PayoutStatus,
  type PaymentTransaction,
  TransactionStatus,
} from '../../types/admin-types';

interface TransactionListProps {
  transactions: PaymentTransaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const getStatusStyles = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.SUCCEEDED:
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
      case TransactionStatus.REFUNDED:
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800';
    }
  };

  const getPayoutDot = (status: PayoutStatus) => {
    switch (status) {
      case PayoutStatus.PAID:
        return 'bg-green-500';
      case PayoutStatus.SCHEDULED:
        return 'bg-yellow-500';
      case PayoutStatus.PROCESSING:
        return 'bg-yellow-500';
      case PayoutStatus.CANCELLED:
        return 'bg-gray-300 dark:bg-gray-600';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-float border border-gray-100 dark:border-gray-700/50 flex-1 flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Transaction History
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Detailed log of all financial movements on the platform.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-sm font-medium bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:text-indigo-500 transition-colors">
            Filter
          </button>
          <button className="px-3 py-1.5 text-sm font-medium bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:text-indigo-500 transition-colors">
            Columns
          </button>
        </div>
      </div>

      <div className="overflow-x-auto -mx-6">
        <table className="w-full text-left border-collapse min-w-200">
          <thead>
            <tr className="text-xs text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
              <th className="py-3 px-6 font-medium uppercase tracking-wider">
                Transaction ID
              </th>
              <th className="py-3 px-6 font-medium uppercase tracking-wider">
                User
              </th>
              <th className="py-3 px-6 font-medium uppercase tracking-wider">
                Date
              </th>
              <th className="py-3 px-6 font-medium uppercase tracking-wider text-right">
                Amount
              </th>
              <th className="py-3 px-6 font-medium uppercase tracking-wider text-right">
                Fee (10%)
              </th>
              <th className="py-3 px-6 font-medium uppercase tracking-wider text-center">
                Status
              </th>
              <th className="py-3 px-6 font-medium uppercase tracking-wider text-center">
                Payout Status
              </th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-800">
            {transactions.map(trx => (
              <tr
                key={trx.id}
                className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="py-4 px-6 font-mono text-gray-500 text-xs">
                  {trx.id}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={trx.user.avatar}
                      className="size-8 rounded-full"
                      alt={trx.user.name}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {trx.user.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {trx.user.role}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-500 whitespace-nowrap">
                  {trx.date}{' '}
                  <span className="text-xs ml-1 text-gray-400">{trx.time}</span>
                </td>
                <td
                  className={`py-4 px-6 font-semibold text-right ${
                    trx.status === TransactionStatus.REFUNDED
                      ? 'text-gray-400 line-through'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  $
                  {trx.amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="py-4 px-6 font-mono text-gray-500 dark:text-gray-400 text-right">
                  $
                  {trx.fee.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="py-4 px-6 text-center">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyles(trx.status)}`}
                  >
                    {trx.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                    <span
                      className={`size-2 rounded-full ${getPayoutDot(trx.payoutStatus)}`}
                    ></span>
                    {trx.payoutStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          Showing 1-5 of 1,248 transactions
        </span>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-xs font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 disabled:opacity-50">
            Previous
          </button>
          <button className="px-3 py-1 text-xs font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
