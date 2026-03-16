import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, BellRing, Plus } from 'lucide-react';
import AppHeader from '@/components/layouts/AppHeader';
import { useAuthStore } from '@/stores/auth.store';
import { getAvatarUrl } from '@/lib/utils';
import FilterButton from '@/components/features/user/bookings/FilterButton';
import PaginationButton from '@/components/features/user/bookings/PaginationButton';
import BookingList from '@/components/features/user/bookings/BookingList';
import { useGetMyBookingRequests } from '@/hooks/user/booking-requests/use-get-my-booking-requests';
import type { BookingUser } from '@/types/user-type';
import type {
  BookingRequestStatus,
  MyBookingRequest,
} from '@/types/booking-request-api';

const formatDateLabel = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatTimeLabel = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDurationLabel = (startIso: string, endIso: string) => {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const diffMs = end.getTime() - start.getTime();
  if (Number.isNaN(diffMs) || diffMs <= 0) return '—';

  const totalMinutes = Math.round(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) return `${hours}h`;
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
};

const mapStatusToUserLabel = (status: BookingRequestStatus) => {
  switch (status) {
    case 'PENDING':
      return 'Pending Approval' as const;
    case 'APPROVED':
      return 'Awaiting Payment' as const;
    case 'COMPLETED':
      return 'Completed' as const;
    case 'CANCELLED':
    case 'REJECTED':
      return 'Cancelled' as const;
    default:
      return 'Pending Approval' as const;
  }
};

const mapMyBookingRequestToBookingUser = (
  request: MyBookingRequest
): BookingUser => {
  const room = request.room;
  const building = room?.building;

  const safeId = request.id ? request.id.replace(/-/g, '').slice(0, 10) : '';
  const startIso = request.startTime;
  const endIso = request.endTime;

  const pricePerHour = room?.pricePerHour ?? 0;
  const start = new Date(startIso);
  const end = new Date(endIso);
  const hours = Math.max(0, (end.getTime() - start.getTime()) / 3600000);
  const estimatedPrice = Math.round(hours * pricePerHour * 100) / 100;

  const imageUrl =
    room?.images?.[0] ||
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800';

  const location =
    building?.address ||
    [building?.buildingName, building?.campus].filter(Boolean).join(' • ') ||
    '—';

  return {
    id: safeId ? `#BR-${safeId.toUpperCase()}` : request.id,
    spaceId: room?.roomCode ?? request.roomId,
    spaceName: room?.name ?? '—',
    location,
    status: mapStatusToUserLabel(request.status),
    date: formatDateLabel(startIso),
    startTime: formatTimeLabel(startIso),
    endTime: formatTimeLabel(endIso),
    duration: formatDurationLabel(startIso, endIso),
    price: Number.isFinite(estimatedPrice) ? estimatedPrice : 0,
    paymentMethod: '—',
    image: imageUrl,
  };
};

const Bookings = () => {
  const { setSidebarOpen } = useOutletContext<{
    setSidebarOpen: (open: boolean) => void;
  }>();
  const user = useAuthStore(state => state.user);
  const [activeTab, setActiveTab] = useState<'Active' | 'Cancelled'>('Active');

  const {
    data: myBookingRequests,
    isLoading,
    isError,
  } = useGetMyBookingRequests();

  const cancelledStatuses: BookingRequestStatus[] = ['CANCELLED', 'REJECTED'];

  const cancelledRequests = (myBookingRequests ?? []).filter(r =>
    cancelledStatuses.includes(r.status)
  );
  const activeRequests = (myBookingRequests ?? []).filter(
    r => !cancelledStatuses.includes(r.status)
  );

  const requestsForTab = activeTab === 'Active' ? activeRequests : cancelledRequests;
  const bookingsForTab = requestsForTab.map(mapMyBookingRequestToBookingUser);

  const headerActions = [
    {
      id: 'notifications',
      icon: <BellRing />,
      badge: true,
      variant: 'ghost' as const,
    },
    {
      id: 'new-booking',
      icon: <Plus className="w-5 h-5" />,
      label: 'New Booking',
      variant: 'primary' as const,
      hideOnMobile: true,
    },
  ];

  return (
    <>
      <AppHeader
        title="My Bookings"
        subtitle="View and manage your space reservations."
        hideTitle={false}
        onMenuClick={() => setSidebarOpen(true)}
        showSearch={false}
        actions={headerActions}
        profile={{
          name: user?.name || 'User',
          subtitle: user?.role || 'USER',
          avatarUrl: getAvatarUrl(user?.name, 'User'),
          showDropdown: true,
        }}
      />
      <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-4 md:p-8 scroll-smooth">
        <div className="max-w-5xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <div className="border-b border-border-light dark:border-border-dark">
              <nav className="flex gap-8">
                {(['Active', 'Cancelled'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab
                        ? 'border-primary text-primary font-bold'
                        : 'border-transparent text-text-sub-light hover:text-text-main-light dark:hover:text-text-main-dark'
                    }`}
                  >
                    {tab}{' '}
                    {tab === 'Active' && (
                      <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                        {activeRequests.length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="relative w-full md:w-96 group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub-light/60 dark:text-text-sub-dark group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  className="pl-10 pr-4 py-2.5 w-full rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark focus:ring-2 focus:ring-primary/50 focus:border-transparent text-sm transition-all shadow-sm placeholder:text-text-sub-light/60"
                  placeholder="Search by building, ID or name..."
                  type="text"
                />
              </div>
              <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                <FilterButton icon="calendar" label="Date Range" />
                <FilterButton icon="domain" label="All Buildings" />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-8 text-center text-sm text-text-sub-light dark:text-text-sub-dark">
              Loading...
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-8 text-center text-sm text-text-sub-light dark:text-text-sub-dark">
              Failed to load bookings.
            </div>
          ) : (
            <BookingList bookings={bookingsForTab} requests={requestsForTab} />
          )}

          <div className="flex items-center justify-center gap-2 py-4">
            <PaginationButton icon="left" disabled />
            <PaginationButton label="1" active />
            <PaginationButton label="2" />
            <PaginationButton label="3" />
            <PaginationButton icon="right" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Bookings;
