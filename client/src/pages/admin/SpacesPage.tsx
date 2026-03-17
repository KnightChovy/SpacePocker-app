import React, { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import AppHeader from '@/components/layouts/AppHeader';
import { useAuthStore } from '@/stores/auth.store';
import { getAvatarUrl } from '@/lib/utils';
import { useGetBookingRequestsForManager } from '@/hooks/manager/booking-requests/use-get-booking-requests';
import type {
  BookingRequestForManager,
  BookingRequestStatus,
} from '@/types/booking-request-api';

const StatusBadge = ({ status }: { status: BookingRequestStatus }) => {
  const config: Record<BookingRequestStatus, { bg: string; text: string }> = {
    APPROVED: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    PENDING: { bg: 'bg-amber-50', text: 'text-amber-600' },
    COMPLETED: { bg: 'bg-blue-50', text: 'text-blue-600' },
    CANCELLED: { bg: 'bg-red-50', text: 'text-red-400' },
    REJECTED: { bg: 'bg-red-50', text: 'text-red-600' },
  };

  const { bg, text } = config[status];
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      {status}
    </span>
  );
};

type BookingRequestStats = Record<BookingRequestStatus, number> & {
  total: number;
};

const StatTile = ({
  icon,
  label,
  value,
  badge,
  badgeColor,
  iconColor,
}: {
  icon: string;
  label: string;
  value: number;
  badge: string;
  badgeColor: string;
  iconColor: string;
}) => (
  <div className="bg-white p-5 rounded-2xl shadow-float border border-gray-100 flex flex-col gap-1 transition-all hover:-translate-y-1 duration-300">
    <div className="flex justify-between items-start">
      <div className={`p-2 rounded-lg ${iconColor}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <span
        className={`flex items-center text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tight ${badgeColor}`}
      >
        {badge}
      </span>
    </div>
    <p className="text-sm font-medium text-text-secondary mt-2">{label}</p>
    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h3>
  </div>
);

const SpacesPage: React.FC = () => {
  const { setSidebarOpen } = useOutletContext<{
    setSidebarOpen: (open: boolean) => void;
  }>();
  const user = useAuthStore(state => state.user);
  const [searchQuery, setSearchQuery] = useState('');

  const pendingQuery = useGetBookingRequestsForManager('PENDING');
  const approvedQuery = useGetBookingRequestsForManager('APPROVED');
  const rejectedQuery = useGetBookingRequestsForManager('REJECTED');
  const cancelledQuery = useGetBookingRequestsForManager('CANCELLED');
  const completedQuery = useGetBookingRequestsForManager('COMPLETED');

  const isLoading =
    pendingQuery.isLoading ||
    approvedQuery.isLoading ||
    rejectedQuery.isLoading ||
    cancelledQuery.isLoading ||
    completedQuery.isLoading;

  const isError =
    pendingQuery.isError ||
    approvedQuery.isError ||
    rejectedQuery.isError ||
    cancelledQuery.isError ||
    completedQuery.isError;

  const stats: BookingRequestStats = useMemo(() => {
    const PENDING = pendingQuery.data?.length ?? 0;
    const APPROVED = approvedQuery.data?.length ?? 0;
    const REJECTED = rejectedQuery.data?.length ?? 0;
    const CANCELLED = cancelledQuery.data?.length ?? 0;
    const COMPLETED = completedQuery.data?.length ?? 0;

    return {
      total: PENDING + APPROVED + REJECTED + CANCELLED + COMPLETED,
      PENDING,
      APPROVED,
      REJECTED,
      CANCELLED,
      COMPLETED,
    };
  }, [
    pendingQuery.data?.length,
    approvedQuery.data?.length,
    rejectedQuery.data?.length,
    cancelledQuery.data?.length,
    completedQuery.data?.length,
  ]);

  const bookingRequests = useMemo(() => {
    const items: BookingRequestForManager[] = [
      ...(pendingQuery.data ?? []),
      ...(approvedQuery.data ?? []),
      ...(rejectedQuery.data ?? []),
      ...(cancelledQuery.data ?? []),
      ...(completedQuery.data ?? []),
    ];

    items.sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return bTime - aTime;
    });

    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return items;
    }

    return items.filter(item => {
      const haystack = [
        item.id,
        item.status,
        item.user?.name,
        item.user?.email,
        item.room?.name,
        item.room?.roomCode ?? '',
        item.purpose ?? '',
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [
    pendingQuery.data,
    approvedQuery.data,
    rejectedQuery.data,
    cancelledQuery.data,
    completedQuery.data,
    searchQuery,
  ]);

  return (
    <>
      <AppHeader
        title="Booking Requests"
        subtitle="Read-only overview of booking requests by status."
        onMenuClick={() => setSidebarOpen(true)}
        showSearch={true}
        searchPlaceholder="Search booking requests..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        profile={{
          name: user?.name || 'Admin',
          subtitle: user?.role || 'ADMIN',
          avatarUrl: getAvatarUrl(user?.name, 'Admin'),
          showDropdown: true,
        }}
        iconType="material"
      />
      <main className="flex-1 overflow-y-auto p-6 lg:p-10">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6">
            <StatTile
              icon="fact_check"
              label="Total Requests"
              value={stats.total}
              badge="Total"
              badgeColor="bg-teal-50 text-secondary"
              iconColor="text-primary bg-indigo-50"
            />
            <StatTile
              icon="pending_actions"
              label="Pending"
              value={stats.PENDING}
              badge="Review"
              badgeColor="bg-yellow-50 text-yellow-600"
              iconColor="text-yellow-600 bg-yellow-50"
            />
            <StatTile
              icon="verified"
              label="Approved"
              value={stats.APPROVED}
              badge="Approved"
              badgeColor="bg-green-50 text-green-600"
              iconColor="text-green-600 bg-green-50"
            />
            <StatTile
              icon="block"
              label="Rejected"
              value={stats.REJECTED}
              badge="Rejected"
              badgeColor="bg-red-50 text-red-600"
              iconColor="text-red-600 bg-red-50"
            />
            <StatTile
              icon="cancel"
              label="Cancelled"
              value={stats.CANCELLED}
              badge="Cancelled"
              badgeColor="bg-gray-50 text-text-secondary"
              iconColor="text-text-secondary bg-gray-50"
            />
            <StatTile
              icon="task_alt"
              label="Completed"
              value={stats.COMPLETED}
              badge="Done"
              badgeColor="bg-blue-50 text-blue-600"
              iconColor="text-blue-600 bg-blue-50"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-float border border-gray-100 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin size-8 border-3 border-primary border-t-transparent rounded-full" />
              </div>
            ) : isError ? (
              <div className="py-10 px-6 text-sm text-red-600">
                Failed to load booking requests.
              </div>
            ) : bookingRequests.length === 0 ? (
              <div className="py-10 px-6 text-sm text-text-secondary">
                No booking requests found.
              </div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-250">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">
                        Request ID
                      </th>
                      <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Room
                      </th>
                      <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bookingRequests.map(request => (
                      <tr
                        key={request.id}
                        className="group hover:bg-primary/5 transition-colors"
                      >
                        <td className="py-4 px-6 text-xs font-mono text-text-gray font-medium">
                          {request.id}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                              {request.user?.name
                                ? request.user.name
                                    .split(' ')
                                    .map(n => n[0])
                                    .slice(0, 2)
                                    .join('')
                                    .toUpperCase()
                                : 'U'}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-text-dark">
                                {request.user?.name ?? 'Unknown'}
                              </div>
                              <div className="text-xs text-text-gray">
                                {request.user?.email ?? ''}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm font-medium text-text-dark">
                            {request.room?.name ?? 'Unknown'}
                          </div>
                          <div className="text-xs text-text-gray">
                            {request.room?.roomCode ?? ''}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col gap-0.5">
                            <div className="text-sm text-text-dark">
                              {new Date(request.startTime).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-text-gray">
                              {new Date(request.startTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}{' '}
                              -{' '}
                              {new Date(request.endTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <StatusBadge status={request.status} />
                        </td>
                        <td className="py-4 px-6 text-sm text-text-gray">
                          {new Date(request.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-12 text-center text-xs text-text-secondary pb-4">
          <p>
            © {new Date().getFullYear()} SPACEPOCKER Inc. All rights reserved.{' '}
            <a className="hover:text-primary ml-2" href="#">
              Privacy Policy
            </a>
          </p>
        </footer>
      </main>
    </>
  );
};

export default SpacesPage;
