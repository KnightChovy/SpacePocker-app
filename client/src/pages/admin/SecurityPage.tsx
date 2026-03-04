import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import AppHeader from '@/components/layouts/AppHeader';
import securityData from '../../data/admin-security.json';

interface SecurityLog {
  id: string;
  timestamp: string;
  event: string;
  user: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'error';
  details: string;
}

const SecurityPage: React.FC = () => {
  const { setSidebarOpen } = useOutletContext<{ setSidebarOpen: (open: boolean) => void }>();

  const headerActions = [
    {
      id: 'refresh',
      icon: <span className="material-symbols-outlined text-[20px]">refresh</span>,
      label: 'Refresh',
      variant: 'ghost' as const,
    },
    {
      id: 'export',
      icon: <span className="material-symbols-outlined text-[20px]">file_download</span>,
      label: 'Export Logs',
      variant: 'primary' as const,
    },
  ];

  const [securityLogs] = useState<SecurityLog[]>(
    securityData.securityLogs.map(log => ({
      ...log,
      status: log.status as 'success' | 'warning' | 'error',
    }))
  );

  const stats = securityData.stats;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'warning':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return 'check_circle';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <>
      <AppHeader
        title="Security & Logs"
        subtitle="Monitor system security events and user activities."
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
      <main className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl bg-${stat.color}-100`}>
                    <span
                      className={`material-symbols-outlined text-${stat.color}-600 text-xl`}
                    >
                      {stat.icon}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.label}
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-100">
                    <span className="material-symbols-outlined text-indigo-600 text-xl">
                      shield
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Recent Security Events
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Real-time security monitoring and audit logs
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold shadow-md hover:bg-indigo-700 transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">
                    download
                  </span>
                  Export Logs
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {securityLogs.map(log => (
                    <tr
                      key={log.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-gray-400 text-[18px]">
                            schedule
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {log.timestamp}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {log.event}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {log.user}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {log.ipAddress}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${getStatusColor(log.status)}`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {getStatusIcon(log.status)}
                          </span>
                          {log.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {log.details}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-red-100">
                  <span className="material-symbols-outlined text-red-600 text-xl">
                    security
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Security Actions
                  </h3>
                  <p className="text-sm text-gray-500">
                    Quick security controls
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 transition-colors flex items-center justify-between">
                  <span>Clear All Sessions</span>
                  <span className="material-symbols-outlined text-[20px]">
                    logout
                  </span>
                </button>
                <button className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 transition-colors flex items-center justify-between">
                  <span>Block Suspicious IPs</span>
                  <span className="material-symbols-outlined text-[20px]">
                    block
                  </span>
                </button>
                <button className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl text-sm font-semibold text-red-700 transition-colors flex items-center justify-between">
                  <span>Emergency Lockdown</span>
                  <span className="material-symbols-outlined text-[20px]">
                    lock
                  </span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-emerald-100">
                  <span className="material-symbols-outlined text-emerald-600 text-xl">
                    verified_user
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    System Health
                  </h3>
                  <p className="text-sm text-gray-500">
                    Current security status
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Firewall Status
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold">
                    <span className="material-symbols-outlined text-[16px]">
                      check_circle
                    </span>
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    SSL Certificate
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold">
                    <span className="material-symbols-outlined text-[16px]">
                      check_circle
                    </span>
                    Valid
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    DDoS Protection
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold">
                    <span className="material-symbols-outlined text-[16px]">
                      check_circle
                    </span>
                    Enabled
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Backup Status
                  </span>
                  <span className="flex items-center gap-1.5 text-blue-600 text-sm font-semibold">
                    <span className="material-symbols-outlined text-[16px]">
                      schedule
                    </span>
                    Last: 2h ago
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
    </>
  );
};

export default SecurityPage;
