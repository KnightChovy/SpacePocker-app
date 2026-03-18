import React, { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, ChevronDown, Bell, MessageSquare } from 'lucide-react';
import AppHeader from '@/components/layouts/AppHeader';
import BookingTable from '../../components/features/manager/bookingManager/BookingTable';
import { useAuthStore } from '@/stores/auth.store';
import { getAvatarUrl } from '@/lib/utils';
import { useGetBookingRequestsForManager } from '@/hooks/manager/booking-requests/use-get-booking-requests';
import { useApproveBookingRequest } from '@/hooks/manager/booking-requests/use-approve-booking-request';
import { useRejectBookingRequest } from '@/hooks/manager/booking-requests/use-reject-booking-request';
import { useCancelBookingRequest } from '@/hooks/manager/booking-requests/use-cancel-booking-request';
import type {
  BookingRequestForManager,
  BookingRequestStatus,
} from '@/types/booking-request-api';

const ManagerBookingPage: React.FC = () => {
  const { setSidebarOpen } = useOutletContext<{
    setSidebarOpen: (open: boolean) => void;
  }>();
  const user = useAuthStore(state => state.user);

  const headerActions = [
    {
      id: 'notifications',
      icon: <Bell className="h-5 w-5" />,
      badge: true,
    },
    {
      id: 'messages',
      icon: <MessageSquare className="h-5 w-5" />,
    },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] =
    useState<BookingRequestStatus>('PENDING');

  const bookingRequestsQuery = useGetBookingRequestsForManager(selectedStatus);
  const approveMutation = useApproveBookingRequest();
  const rejectMutation = useRejectBookingRequest();
  const cancelMutation = useCancelBookingRequest();

  const bookingRequests = useMemo(() => {
    const items = bookingRequestsQuery.data ?? [];
    if (!searchQuery.trim()) {
      return items;
    }

    const q = searchQuery.trim().toLowerCase();
    return items.filter(item => {
      const haystack = [
        item.id,
        item.user?.name,
        item.user?.email,
        item.room?.name,
        item.room?.roomCode ?? '',
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [bookingRequestsQuery.data, searchQuery]);

  const handleApprove = async (request: BookingRequestForManager) => {
    await approveMutation.mutateAsync(request.id);
  };

  const handleReject = async (request: BookingRequestForManager) => {
    if (window.confirm('Reject this booking request?')) {
      await rejectMutation.mutateAsync(request.id);
    }
  };

  const handleCancel = async (request: BookingRequestForManager) => {
    if (window.confirm('Cancel this completed booking?')) {
      await cancelMutation.mutateAsync(request.id);
    }
  };

  return (
    <>
      <AppHeader
        title="Booking Requests"
        subtitle="Approve or reject incoming room booking requests."
        onMenuClick={() => setSidebarOpen(true)}
        actions={headerActions}
        profile={{
          name: user?.name || 'Manager',
          subtitle: user?.role || 'MANAGER',
          avatarUrl: getAvatarUrl(user?.name, 'Manager'),
          showDropdown: true,
        }}
      />
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8 custom-scrollbar relative">
        <div className="max-w-300 mx-auto w-full">
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search booking requests..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div className="relative">
              <select
                value={selectedStatus}
                onChange={e =>
                  setSelectedStatus(e.target.value as BookingRequestStatus)
                }
                className="appearance-none pl-3 pr-8 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
              >
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="COMPLETED">Completed</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="pb-20">
            {bookingRequestsQuery.isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin size-8 border-3 border-primary border-t-transparent rounded-full" />
              </div>
            ) : bookingRequestsQuery.isError ? (
              <div className="py-10 text-sm text-red-600">
                Failed to load booking requests.
              </div>
            ) : (
              <BookingTable
                requests={bookingRequests}
                onApprove={handleApprove}
                onReject={handleReject}
                onCancel={handleCancel}
                isApproving={approveMutation.isPending}
                isRejecting={rejectMutation.isPending}
                isCancelling={cancelMutation.isPending}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ManagerBookingPage;
