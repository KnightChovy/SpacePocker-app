import React from 'react';
import type { Transaction } from '@/types/admin/admin-types';
import { formatVND } from '@/lib/utils';

interface Props {
  transactions: Transaction[];
}

const TransactionTable: React.FC<Props> = ({ transactions }) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-8 flex items-center justify-between border-b border-gray-50">
        <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
   
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Transaction ID
              </th>
              <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Space
              </th>
              <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">
                Date
              </th>
              <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">
                Amount
              </th>
              <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.map(trx => (
              <tr
                key={trx.id}
                className="hover:bg-gray-50/50 transition-colors group"
              >
                <td className="px-8 py-5 text-sm font-mono text-gray-400">
                  {trx.id}
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={trx.userAvatar}
                      alt={trx.userName}
                      className="w-8 h-8 rounded-full shadow-sm"
                    />
                    <span className="text-sm font-bold text-gray-900">
                      {trx.userName}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5 text-sm text-gray-600 font-medium">
                  {trx.spaceName}
                </td>
                <td className="px-8 py-5 text-sm text-gray-500 text-center font-medium">
                  {trx.date}
                </td>
                <td className="px-8 py-5 text-sm font-bold text-gray-900 text-right">
                  {formatVND(trx.amount)}
                </td>
                <td className="px-8 py-5 text-center">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold ${
                      trx.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        trx.status === 'Completed'
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                      }`}
                    ></span>
                    {trx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
