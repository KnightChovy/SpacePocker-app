import { useOutletContext, useNavigate } from 'react-router-dom';
import { Calendar, Plus } from 'lucide-react';
import AppHeader from '@/components/layouts/AppHeader';
import StatCard from '@/components/features/user/dashboard/StatCard';
import BookingNotificationsBell from '@/components/features/user/dashboard/BookingNotificationsBell';
import BookingList, {
  type DashboardBookingItem,
} from '@/components/features/user/dashboard/BookingList';
import { useAuthStore } from '@/stores/auth.store';
import { formatVND, getAvatarUrl } from '@/lib/utils';
import { useGetMyBookingRequests } from '@/hooks/user/booking-requests/use-get-my-booking-requests';
import { useGetServiceCategories } from '@/hooks/user/service-categories/use-get-service-categories';
import { useBookingDraftStore, type LocalBookingRecord } from '@/stores/bookingDraft.store';
import { useMemo } from 'react';

const Dashboard = () => {
  const { setSidebarOpen } = useOutletContext<{
    setSidebarOpen: (open: boolean) => void;
  }>();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);

  const localBookingsById = useBookingDraftStore(
    state => state.localBookingsById
  );
  const serviceCategoriesQuery = useGetServiceCategories();

  const serviceById = useMemo(() => {
    const map = new Map<string, { name: string; price: number }>();
    const categories = serviceCategoriesQuery.data ?? [];
    for (const cat of categories) {
      for (const s of cat.services ?? []) {
        map.set(s.id, { name: s.name, price: s.price });
      }
    }
    return map;
  }, [serviceCategoriesQuery.data]);

  const readPersistedBookingStorage = ():
    | { localBookingsById?: Record<string, LocalBookingRecord> }
    | undefined => {
    if (typeof window === 'undefined') return undefined;
    try {
      const raw = window.localStorage.getItem('spacepocker-booking-storage');
      if (!raw) return undefined;
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const state = parsed?.state ?? parsed;
      return {
        localBookingsById: (state as Record<string, unknown>)
          ?.localBookingsById as Record<string, LocalBookingRecord> | undefined,
      };
    } catch {
      return undefined;
    }
  };

  const bookingRequestsQuery = useGetMyBookingRequests();

  const dashboardBookings = useMemo<DashboardBookingItem[]>(() => {
    const requests = bookingRequestsQuery.data ?? [];

    return [...requests]
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      )
      .slice(0, 3)
      .map(request => {
        const start = new Date(request.startTime);
        const end = new Date(request.endTime);

        return {
          id: request.id,
          spaceName: request.room?.name ?? 'Unknown Space',
          location:
            request.room?.building?.buildingName ||
            request.room?.building?.campus ||
            request.room?.building?.address ||
            'Unknown location',
          status: request.status,
          date: Number.isNaN(start.getTime())
            ? 'Unknown date'
            : start.toLocaleDateString(),
          startTime: Number.isNaN(start.getTime())
            ? '—'
            : start.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
          endTime: Number.isNaN(end.getTime())
            ? '—'
            : end.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
          image: request.room?.images?.[0] ?? '',
        };
      });
  }, [bookingRequestsQuery.data]);

  const stats = useMemo(() => {
    const requests = bookingRequestsQuery.data ?? [];
    
    const persisted = readPersistedBookingStorage();

    const totalBookings = requests.length;
    const totalHours = requests.reduce((sum, request) => {
      const start = new Date(request.startTime).getTime();
      const end = new Date(request.endTime).getTime();
      if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return sum;
      return sum + (end - start) / (1000 * 60 * 60);
    }, 0);

    const estimatedCredits = requests.reduce((sum, request) => {
      const start = new Date(request.startTime).getTime();
      const end = new Date(request.endTime).getTime();
      if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return sum;
      const hours = (end - start) / (1000 * 60 * 60);

      let extraPrice = 0;
      const fromLocal = localBookingsById[request.id] ?? persisted?.localBookingsById?.[request.id];
      if (fromLocal && fromLocal.services) {
        for (const svcItem of fromLocal.services) {
          if (!svcItem?.serviceId) continue;
          const svc = serviceById.get(svcItem.serviceId);
          if (svc) {
            const qty = Number(svcItem.quantity ?? 1);
            extraPrice += svc.price * (Number.isFinite(qty) ? qty : 1);
          }
        }
      }

      return sum + hours * (request.room?.pricePerHour ?? 0) + extraPrice;
    }, 0);

    return {
      totalBookings,
      totalHours,
      estimatedCredits,
    };
  }, [bookingRequestsQuery.data, localBookingsById, serviceById]);

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
        title="Dashboard"
        hideTitle={false}
        onMenuClick={() => setSidebarOpen(true)}
        showSearch={false}
        searchPlaceholder="Search for spaces, bookings..."
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
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-text-main-light dark:text-text-main-dark mb-2">
                Welcome back, {user?.name?.split(' ')[0] || 'User'}{' '}
                <span className="inline-block animate-bounce">👋</span>
              </h1>
              <p className="text-text-sub-light dark:text-text-sub-dark text-base">
                Here's what's happening with your space rentals today.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-text-sub-light bg-surface-light dark:bg-surface-dark px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark shadow-sm">
              <span className=" text-primary text-[18px]">
                <Calendar />
              </span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <StatCard
              icon="event"
              title="Total Bookings"
              value={stats.totalBookings.toString()}
              trend="+12%"
              colorClass="blue"
            />
            <StatCard
              icon="timer"
              title="Hours Spent"
              value={`${Math.round(stats.totalHours)}h`}
              colorClass="purple"
            />
            <StatCard
              icon="payments"
              title="Credits Available"
              value={formatVND(stats.estimatedCredits)}
              topUp
              colorClass="amber"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <BookingList
              bookings={dashboardBookings}
              isLoading={bookingRequestsQuery.isLoading}
              isError={bookingRequestsQuery.isError}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
