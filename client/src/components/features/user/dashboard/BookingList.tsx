import {
  Calendar,
  ChevronRight,
  History,
  MapPin,
  MessageSquareText,
  Pencil,
  Timer,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBookingReviewStore } from '@/stores/bookingReview.store';

export interface DashboardBookingItem {
  id: string;
  spaceName: string;
  location: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
  date: string;
  startTime: string;
  endTime: string;
  image: string;
}

interface BookingListProps {
  bookings: DashboardBookingItem[];
  isLoading?: boolean;
  isError?: boolean;
}

const bookingStatusLabel: Record<DashboardBookingItem['status'], string> = {
  PENDING: 'Pending Approval',
  APPROVED: 'Confirmed',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
};

const bookingStatusClass: Record<DashboardBookingItem['status'], string> = {
  APPROVED:
    'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800',
  PENDING:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
  COMPLETED:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
  REJECTED:
    'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800',
  CANCELLED:
    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700',
};

const BookingList = ({
  bookings,
  isLoading = false,
  isError = false,
}: BookingListProps) => {
  const navigate = useNavigate();
  const isBookingReviewed = useBookingReviewStore(s => s.isBookingReviewed);

  if (isLoading) {
    return (
      <div className="lg:col-span-2 flex flex-col gap-4">
        <h2 className="text-xl font-bold">Upcoming Bookings</h2>
        <div className="rounded-2xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-6 text-sm text-text-sub-light dark:text-text-sub-dark">
          Loading bookings...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="lg:col-span-2 flex flex-col gap-4">
        <h2 className="text-xl font-bold">Upcoming Bookings</h2>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Failed to load bookings.
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          Upcoming Bookings
          <span className="text-xs font-medium text-text-sub-light bg-border-light dark:bg-border-dark px-2 py-0.5 rounded-full">
            {bookings.length}
          </span>
        </h2>
        <button
          onClick={() => navigate('/user/bookings')}
          className="text-sm font-semibold text-primary hover:text-primary-dark hover:underline transition-colors flex items-center"
        >
          View All <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {bookings.length === 0 ? (
          <div className="rounded-2xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-6 text-sm text-text-sub-light dark:text-text-sub-dark">
            No bookings yet.
          </div>
        ) : (
          bookings.map(booking => (
            <div
              key={booking.id}
              className="group flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:border-primary/50 dark:hover:border-primary/50 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="relative w-full sm:w-32 h-24 rounded-xl overflow-hidden shrink-0">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${booking.image}')` }}
                ></div>
              </div>
              <div className="flex-1 w-full text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:justify-between items-center sm:items-start mb-1">
                  <h3 className="text-base font-bold">{booking.spaceName}</h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${bookingStatusClass[booking.status]}`}
                  >
                    {bookingStatusLabel[booking.status]}
                  </span>
                </div>
                <p className="text-sm text-text-sub-light dark:text-text-sub-dark mb-3 flex items-center justify-center sm:justify-start gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {booking.location}
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-4 text-xs font-medium text-text-sub-light dark:text-text-sub-dark">
                  <span className="flex items-center gap-1 bg-background-light dark:bg-background-dark px-2 py-1 rounded-md">
                    <Calendar className="h-3 w-3" />{' '}
                    {booking.date.split(',')[0]}
                  </span>
                  {booking.status !== 'COMPLETED' ? (
                    <span className="flex items-center gap-1 bg-background-light dark:bg-background-dark px-2 py-1 rounded-md">
                      <Timer className="h-3 w-3" /> {booking.startTime} -{' '}
                      {booking.endTime}
                    </span>
                  ) : isBookingReviewed(booking.id) ? (
                    <span className="flex items-center gap-1 text-emerald-600">
                      Review Submitted
                    </span>
                  ) : (
                    <button className="flex items-center gap-1 text-primary hover:underline">
                      Write Review
                    </button>
                  )}
                </div>
              </div>
              <div className="sm:border-l border-border-light dark:border-border-dark sm:pl-4 flex sm:flex-col gap-2">
                <button className="p-2 rounded-lg text-text-sub-light hover:bg-background-light hover:text-primary transition-colors">
                  {booking.status !== 'COMPLETED' ? <Pencil /> : <History />}
                </button>
                {booking.status !== 'COMPLETED' && (
                  <button className="p-2 rounded-lg text-text-sub-light hover:bg-background-light hover:text-primary transition-colors">
                    <MessageSquareText />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingList;
