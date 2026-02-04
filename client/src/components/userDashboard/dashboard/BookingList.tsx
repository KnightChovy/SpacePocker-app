import {
  Calendar,
  ChevronRight,
  History,
  MapPin,
  MessageSquareText,
  Pencil,
  Timer,
} from 'lucide-react';
import { BOOKINGSUSER } from '@/data/constant';

const BookingList = () => {
  return (
    <div className="lg:col-span-2 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          Upcoming Bookings
          <span className="text-xs font-medium text-text-sub-light bg-border-light dark:bg-border-dark px-2 py-0.5 rounded-full">
            3
          </span>
        </h2>
        <button className="text-sm font-semibold text-primary hover:text-primary-dark hover:underline transition-colors flex items-center">
          View All <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {BOOKINGSUSER.map((booking, idx) => (
          <div
            key={idx}
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
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    idx === 0
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                      : idx === 1
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {idx === 0
                    ? 'Confirmed'
                    : idx === 1
                      ? 'Pending Approval'
                      : 'Completed'}
                </span>
              </div>
              <p className="text-sm text-text-sub-light dark:text-text-sub-dark mb-3 flex items-center justify-center sm:justify-start gap-1">
                <MapPin className="h-3.5 w-3.5" /> {booking.location}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-4 text-xs font-medium text-text-sub-light dark:text-text-sub-dark">
                <span className="flex items-center gap-1 bg-background-light dark:bg-background-dark px-2 py-1 rounded-md">
                  <Calendar className="h-3 w-3" /> {booking.date.split(',')[0]}
                </span>
                {idx < 2 ? (
                  <span className="flex items-center gap-1 bg-background-light dark:bg-background-dark px-2 py-1 rounded-md">
                    <Timer className="h-3 w-3" /> {booking.startTime} -{' '}
                    {booking.endTime}
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
                {idx < 2 ? <Pencil /> : <History />}
              </button>
              {idx < 2 && (
                <button className="p-2 rounded-lg text-text-sub-light hover:bg-background-light hover:text-primary transition-colors">
                  <MessageSquareText />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingList;
