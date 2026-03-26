import { useEffect, useMemo, useState } from 'react';
import {
  useOutletContext,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { Search, Plus, CircleCheckBig, CircleAlert, X } from 'lucide-react';
import AppHeader from '@/components/layouts/AppHeader';
import { useAuthStore } from '@/stores/auth.store';
import { getAvatarUrl } from '@/lib/utils';
import FilterButton from '@/components/features/user/bookings/FilterButton';
import PaginationButton from '@/components/features/user/bookings/PaginationButton';
import BookingList from '@/components/features/user/bookings/BookingList';
import BookingNotificationsBell from '@/components/features/user/dashboard/BookingNotificationsBell';
import { useGetMyBookingRequests } from '@/hooks/user/booking-requests/use-get-my-booking-requests';
import { useCancelMyBookingRequest } from '@/hooks/user/booking-requests/use-cancel-my-booking-request';
import { useGetServiceCategories } from '@/hooks/user/service-categories/use-get-service-categories';
import type { BookingUser } from '@/types/user/user-type';
import type {
  BookingRequestStatus,
  MyBookingRequest,
} from '@/types/user/booking-request-api';
import { useBookingDraftStore } from '@/stores/bookingDraft.store';

type DateRangeValue = {
  from: string;
  to: string;
};

type BuildingFilterOption = {
  id: string;
  label: string;
};

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
    case 'CHECKED_IN':
      return 'Checked In' as const;
    case 'CANCELLED':
      return 'Cancelled' as const;
    case 'REJECTED':
      return 'Rejected' as const;
    default:
      return 'Pending Approval' as const;
  }
};

const mapMyBookingRequestToBookingUser = (
  request: MyBookingRequest,
  totalPrice: number
): BookingUser => {
  const room = request.room;
  const building = room?.building;

  const safeId = request.id ? request.id.replace(/-/g, '').slice(0, 10) : '';
  const startIso = request.startTime;
  const endIso = request.endTime;

  const estimatedPrice = Math.round(totalPrice * 100) / 100;

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
  const PAGE_SIZE = 10;
  const { setSidebarOpen } = useOutletContext<{
    setSidebarOpen: (open: boolean) => void;
  }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useAuthStore(state => state.user);
  const [activeTab, setActiveTab] = useState<'Active' | 'Cancelled'>('Active');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<DateRangeValue>({
    from: '',
    to: '',
  });
  const [selectedBuildingId, setSelectedBuildingId] = useState('ALL');
  const [dismissedPaymentToken, setDismissedPaymentToken] = useState<
    string | null
  >(null);

  const paymentStatusParam = searchParams.get('paymentStatus');
  const bookingRequestIdParam =
    searchParams.get('bookingRequestId') ?? undefined;
  const paymentToken = `${paymentStatusParam ?? ''}:${bookingRequestIdParam ?? ''}`;
  const paymentReturn =
    (paymentStatusParam === 'success' || paymentStatusParam === 'failed') &&
    dismissedPaymentToken !== paymentToken
      ? {
          status: paymentStatusParam,
          bookingRequestId: bookingRequestIdParam,
        }
      : null;

  useEffect(() => {
    const paymentStatus = searchParams.get('paymentStatus');
    if (paymentStatus !== 'success' && paymentStatus !== 'failed') return;

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('paymentStatus');
    nextParams.delete('bookingRequestId');
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const localBookingsById = useBookingDraftStore(
    state => state.localBookingsById
  );

  const serviceCategoriesQuery = useGetServiceCategories();
  const servicePriceById = useMemo(() => {
    const map = new Map<string, number>();
    for (const cat of serviceCategoriesQuery.data ?? []) {
      for (const svc of cat.services ?? []) {
        map.set(svc.id, svc.price);
      }
    }
    return map;
  }, [serviceCategoriesQuery.data]);

  const readPersistedBookingStorage = () => {
    if (typeof window === 'undefined') return undefined;
    try {
      const raw = window.localStorage.getItem('spacepocker-booking-storage');
      if (!raw) return undefined;
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const state = (parsed?.state ?? parsed) as Record<string, unknown>;
      const localBookingsById = state?.localBookingsById as
        | Record<
            string,
            {
              amenityIds?: string[];
              services?: Array<{ serviceId: string; quantity: number }>;
            }
          >
        | undefined;
      if (localBookingsById) {
        return { localBookingsById };
      }
      return undefined;
    } catch {
      return undefined;
    }
  };

  const {
    data: myBookingRequests,
    isLoading,
    isError,
  } = useGetMyBookingRequests();
  const cancelMyBookingRequestMutation = useCancelMyBookingRequest();

  const cancelledStatuses: BookingRequestStatus[] = ['CANCELLED', 'REJECTED'];

  const cancelledRequests = (myBookingRequests ?? []).filter(r =>
    cancelledStatuses.includes(r.status)
  );
  const activeRequests = (myBookingRequests ?? []).filter(
    r => !cancelledStatuses.includes(r.status)
  );

  const requestsForTab =
    activeTab === 'Active' ? activeRequests : cancelledRequests;

  const buildingOptions = useMemo<BuildingFilterOption[]>(() => {
    const optionsById = new Map<string, BuildingFilterOption>();

    for (const req of requestsForTab) {
      const building = req.room?.building;
      if (!building?.id) continue;

      const label =
        building.buildingName ||
        building.campus ||
        building.address ||
        `Building ${building.id.slice(0, 6)}`;

      optionsById.set(building.id, {
        id: building.id,
        label,
      });
    }

    return Array.from(optionsById.values()).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }, [requestsForTab]);

  const effectiveSelectedBuildingId =
    selectedBuildingId === 'ALL' ||
    buildingOptions.some(option => option.id === selectedBuildingId)
      ? selectedBuildingId
      : 'ALL';

  const filteredRequestsForTab = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    const fromTs = dateRange.from
      ? new Date(`${dateRange.from}T00:00:00`).getTime()
      : null;
    const toTs = dateRange.to
      ? new Date(`${dateRange.to}T23:59:59.999`).getTime()
      : null;

    return requestsForTab.filter(req => {
      if (
        effectiveSelectedBuildingId !== 'ALL' &&
        req.room?.building?.id !== effectiveSelectedBuildingId
      ) {
        return false;
      }

      const startTs = new Date(req.startTime).getTime();
      if (!Number.isNaN(startTs)) {
        if (fromTs !== null && startTs < fromTs) return false;
        if (toTs !== null && startTs > toTs) return false;
      }

      if (!keyword) return true;

      const searchFields = [
        req.id,
        req.room?.name,
        req.room?.roomCode,
        req.room?.building?.buildingName,
        req.room?.building?.campus,
        req.room?.building?.address,
      ]
        .filter(Boolean)
        .map(field => String(field).toLowerCase());

      return searchFields.some(field => field.includes(keyword));
    });
  }, [
    dateRange.from,
    dateRange.to,
    effectiveSelectedBuildingId,
    requestsForTab,
    searchQuery,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeTab,
    searchQuery,
    dateRange.from,
    dateRange.to,
    effectiveSelectedBuildingId,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRequestsForTab.length / PAGE_SIZE)
  );

  useEffect(() => {
    setCurrentPage(prev => Math.min(prev, totalPages));
  }, [totalPages]);

  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRequestsForTab.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredRequestsForTab]);

  const bookingsForTab = paginatedRequests.map(req => {
    const start = new Date(req.startTime);
    const end = new Date(req.endTime);
    const hours = Math.max(0, (end.getTime() - start.getTime()) / 3600000);
    const rate = req.room?.pricePerHour ?? 0;
    const roomLine = rate * hours;

    const persisted = readPersistedBookingStorage();
    const local = req.id
      ? (localBookingsById[req.id] ?? persisted?.localBookingsById?.[req.id])
      : undefined;

    const servicesLine = (local?.services ?? []).reduce((sum, line) => {
      const price = servicePriceById.get(line.serviceId) ?? 0;
      const qty = Number(line.quantity ?? 0);
      if (!Number.isFinite(qty) || qty <= 0) return sum;
      return sum + price * qty;
    }, 0);

    const totalPrice = roomLine + servicesLine;

    return mapMyBookingRequestToBookingUser(req, totalPrice);
  });

  const handleCancelBookingRequest = async (bookingRequestId: string) => {
    if (!bookingRequestId) return;

    if (!window.confirm('Cancel this booking request?')) {
      return;
    }

    await cancelMyBookingRequestMutation.mutateAsync(bookingRequestId);
  };

  const headerActions = [
    {
      id: 'new-booking',
      icon: <Plus className="w-5 h-5" />,
      label: 'New Booking',
      variant: 'primary' as const,
      hideOnMobile: true,
      onClick: () => navigate('/spaces'),
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
        rightExtra={<BookingNotificationsBell />}
        profile={{
          name: user?.name || 'User',
          subtitle: user?.role || 'USER',
          avatarUrl: getAvatarUrl(user?.name, 'User'),
          showDropdown: true,
        }}
      />
      <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-4 md:p-8 scroll-smooth">
        <div className="max-w-5xl mx-auto flex flex-col gap-8">
          {paymentReturn ? (
            <div className="rounded-2xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 flex items-start gap-3">
              {paymentReturn.status === 'success' ? (
                <CircleCheckBig className="h-5 w-5 mt-0.5 text-primary" />
              ) : (
                <CircleAlert className="h-5 w-5 mt-0.5 text-text-sub-light dark:text-text-sub-dark" />
              )}
              <div className="flex-1">
                <div className="font-semibold text-text-main-light dark:text-text-main-dark">
                  {paymentReturn.status === 'success'
                    ? 'Payment successful'
                    : 'Payment failed or cancelled'}
                </div>
                <div className="text-sm text-text-sub-light dark:text-text-sub-dark">
                  {paymentReturn.status === 'success'
                    ? 'Your booking has been confirmed.'
                    : 'Please try again to complete your payment.'}
                  {paymentReturn.bookingRequestId
                    ? ` (Request: ${paymentReturn.bookingRequestId})`
                    : ''}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDismissedPaymentToken(paymentToken)}
                className="p-1.5 rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition-colors"
                aria-label="Dismiss payment status"
              >
                <X className="h-4 w-4 text-text-sub-light dark:text-text-sub-dark" />
              </button>
            </div>
          ) : null}

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
                  value={searchQuery}
                  onChange={event => setSearchQuery(event.target.value)}
                />
              </div>
              <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                <FilterButton
                  icon="calendar"
                  label="Date Range"
                  isActive={Boolean(dateRange.from || dateRange.to)}
                >
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-text-sub-light dark:text-text-sub-dark">
                        From
                      </label>
                      <input
                        type="date"
                        value={dateRange.from}
                        onChange={event =>
                          setDateRange(prev => ({
                            ...prev,
                            from: event.target.value,
                          }))
                        }
                        className="mt-1 w-full rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/30"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-text-sub-light dark:text-text-sub-dark">
                        To
                      </label>
                      <input
                        type="date"
                        value={dateRange.to}
                        min={dateRange.from || undefined}
                        onChange={event =>
                          setDateRange(prev => ({
                            ...prev,
                            to: event.target.value,
                          }))
                        }
                        className="mt-1 w-full rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/30"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setDateRange({ from: '', to: '' })}
                      className="w-full rounded-lg border border-border-light dark:border-border-dark px-3 py-2 text-sm font-medium text-text-sub-light dark:text-text-sub-dark hover:border-primary/40 hover:text-primary transition-colors"
                    >
                      Clear date filter
                    </button>
                  </div>
                </FilterButton>

                <FilterButton
                  icon="domain"
                  label={
                    effectiveSelectedBuildingId === 'ALL'
                      ? 'All Buildings'
                      : (buildingOptions.find(
                          option => option.id === effectiveSelectedBuildingId
                        )?.label ?? 'All Buildings')
                  }
                  isActive={effectiveSelectedBuildingId !== 'ALL'}
                >
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => setSelectedBuildingId('ALL')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        effectiveSelectedBuildingId === 'ALL'
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'hover:bg-background-light dark:hover:bg-background-dark text-text-main-light dark:text-text-main-dark'
                      }`}
                    >
                      All Buildings
                    </button>

                    {buildingOptions.map(option => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedBuildingId(option.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          effectiveSelectedBuildingId === option.id
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'hover:bg-background-light dark:hover:bg-background-dark text-text-main-light dark:text-text-main-dark'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </FilterButton>
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
            <BookingList
              bookings={bookingsForTab}
              requests={paginatedRequests}
              onCancelRequest={handleCancelBookingRequest}
              isCancelling={cancelMyBookingRequestMutation.isPending}
            />
          )}

          <div className="flex items-center justify-center gap-2 py-4">
            <PaginationButton
              icon="left"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            />
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              return (
                <PaginationButton
                  key={page}
                  label={String(page)}
                  active={page === currentPage}
                  onClick={() => setCurrentPage(page)}
                />
              );
            })}
            <PaginationButton
              icon="right"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage(prev => Math.min(totalPages, prev + 1))
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Bookings;
