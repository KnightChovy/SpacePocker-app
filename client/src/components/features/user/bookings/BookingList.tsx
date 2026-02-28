import { BOOKINGSUSER } from '@/data/constant';
import { Calendar, CircleCheckBig, MapPin, Star, Timer } from 'lucide-react';
import ActionButton from './ActionButton';

const BookingList = () => {
  return (
    <div className="flex flex-col gap-5">
      {BOOKINGSUSER.map((booking, idx) => (
        <div
          key={idx}
          className="group flex flex-col md:flex-row bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
        >
          <div
            className="w-full md:w-60 h-48 md:h-auto rounded-xl bg-cover bg-center shrink-0 mb-4 md:mb-0 md:mr-6 relative overflow-hidden"
            style={{ backgroundImage: `url('${booking.image}')` }}
          >
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-mono font-bold text-text-sub-light dark:text-text-sub-dark bg-background-light dark:bg-background-dark px-2 py-1 rounded-md border border-border-light dark:border-border-dark">
                    {booking.id}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                    {booking.status}
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-1">
                  {booking.spaceName}
                </h3>
                <p className="text-sm text-text-sub-light dark:text-text-sub-dark flex items-center gap-1">
                  <MapPin className="w-4.5 h-4.5" /> {booking.location}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-xl font-bold">
                  ${booking.price.toFixed(2)}
                </div>
                <div className="text-xs text-text-sub-light dark:text-text-sub-dark mt-0.5">
                  Paid via {booking.paymentMethod}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-8 my-6 p-4 rounded-xl bg-background-light dark:bg-background-dark/50 border border-border-light dark:border-border-dark text-sm text-text-sub-light dark:text-text-sub-dark">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="font-medium text-text-main-light dark:text-text-main-dark">
                  {booking.date}
                </span>
              </div>
              <div className="w-px h-4 bg-border-dark/20 dark:bg-border-light/20 hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-primary" />
                <span>
                  {booking.startTime} - {booking.endTime}
                </span>
                <span className="text-xs bg-surface-light dark:bg-surface-dark px-2 py-0.5 rounded border border-border-light dark:border-border-dark ml-1 font-semibold">
                  {booking.duration}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4 border-t border-border-light dark:border-border-dark mt-auto">
              <ActionButton icon="receipt" label="Get Receipt" />
              <ActionButton icon="replay" label="Rebook" />
              {idx === 1 ? (
                <button
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-background-light dark:bg-surface-dark text-text-sub-light border border-transparent shadow-none cursor-not-allowed flex items-center gap-2 ml-auto opacity-70"
                  disabled
                >
                  <CircleCheckBig className="h-5 w-5 text-emerald-500" /> Review
                  Submitted
                </button>
              ) : (
                <button className="px-5 py-2 rounded-xl text-sm font-bold bg-white dark:bg-surface-dark text-text-main-light dark:text-text-main-dark border border-border-light dark:border-border-dark shadow-sm hover:shadow hover:text-primary transition-all flex items-center gap-2 ml-auto">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />{' '}
                  Write Review
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingList;
