import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellRing } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useGetMyBookingRequests } from '@/hooks/user/booking-requests/use-get-my-booking-requests';
import type { BookingRequestStatus } from '@/types/booking-request-api';

const STATUS_LABEL: Record<BookingRequestStatus, string> = {
  PENDING: 'Waiting for approval',
  APPROVED: 'Approved - waiting for payment',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
};

const STATUS_DOT_CLASS: Record<BookingRequestStatus, string> = {
  PENDING: 'bg-amber-500',
  APPROVED: 'bg-emerald-500',
  REJECTED: 'bg-red-500',
  CANCELLED: 'bg-slate-400',
  COMPLETED: 'bg-blue-500',
};

const formatNotificationTime = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Unknown time';

  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function BookingNotificationsBell() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const bookingRequestsQuery = useGetMyBookingRequests();

  const notifications = useMemo(() => {
    const requests = bookingRequestsQuery.data ?? [];
    return [...requests]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 6);
  }, [bookingRequestsQuery.data]);

  const unreadCount = useMemo(
    () =>
      (bookingRequestsQuery.data ?? []).filter(req => req.status !== 'PENDING')
        .length,
    [bookingRequestsQuery.data]
  );

  const goToBookings = () => {
    setOpen(false);
    navigate('/user/bookings');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Booking notifications"
          className="h-10 w-10 flex items-center justify-center rounded-xl transition-all relative bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark text-slate-600 dark:text-text-sub-dark hover:text-primary hover:border-primary/30"
        >
          <BellRing className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-85 p-0">
        <div className="px-4 py-3 border-b border-border-light dark:border-border-dark">
          <p className="text-sm font-bold text-text-main-light dark:text-text-main-dark">
            Booking Notifications
          </p>
          <p className="text-xs text-text-sub-light dark:text-text-sub-dark mt-0.5">
            Latest updates from your booking requests.
          </p>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {bookingRequestsQuery.isLoading && (
            <p className="px-4 py-6 text-sm text-text-sub-light dark:text-text-sub-dark">
              Loading notifications...
            </p>
          )}

          {bookingRequestsQuery.isError && (
            <p className="px-4 py-6 text-sm text-red-500">
              Could not load notifications.
            </p>
          )}

          {!bookingRequestsQuery.isLoading &&
            !bookingRequestsQuery.isError &&
            notifications.length === 0 && (
              <p className="px-4 py-6 text-sm text-text-sub-light dark:text-text-sub-dark">
                No booking notifications yet.
              </p>
            )}

          {!bookingRequestsQuery.isLoading &&
            !bookingRequestsQuery.isError &&
            notifications.map(notification => (
              <button
                key={notification.id}
                type="button"
                onClick={goToBookings}
                className="w-full text-left px-4 py-3 border-b last:border-b-0 border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors"
              >
                <div className="flex items-start gap-2">
                  <span
                    className={`mt-1.5 h-2 w-2 rounded-full ${STATUS_DOT_CLASS[notification.status]}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-main-light dark:text-text-main-dark truncate">
                      {notification.room?.name ?? 'Booking request'}
                    </p>
                    <p className="text-xs text-text-sub-light dark:text-text-sub-dark mt-0.5">
                      {STATUS_LABEL[notification.status]}
                    </p>
                    <p className="text-[11px] text-text-sub-light dark:text-text-sub-dark mt-1">
                      {formatNotificationTime(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
        </div>

        <div className="p-2 border-t border-border-light dark:border-border-dark">
          <button
            type="button"
            onClick={goToBookings}
            className="w-full text-sm font-semibold rounded-lg px-3 py-2 text-primary hover:bg-primary/10 transition-colors"
          >
            View all bookings
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
