import { X, Calendar, Clock, User, MapPin, DollarSign } from 'lucide-react';
import type { Booking, BookingStatus } from '@/types/user/types';
import { BookingStatusLabel } from '@/types/user/types';
import { formatVND } from '@/lib/utils';

interface BookingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onUpdateStatus?: (id: string, status: BookingStatus) => void;
}

const StatusBadge = ({ status }: { status: BookingStatus }) => {
  const config: Record<BookingStatus, { bg: string; text: string }> = {
    confirmed: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    pending: { bg: 'bg-amber-50', text: 'text-amber-600' },
    completed: { bg: 'bg-blue-50', text: 'text-blue-600' },
    cancelled: { bg: 'bg-red-50', text: 'text-red-400' },
  };

  const { bg, text } = config[status];
  const label = BookingStatusLabel[status];

  return (
    <span
      className={`px-3 py-1.5 rounded-full text-sm font-medium ${bg} ${text}`}
    >
      {label}
    </span>
  );
};

const BookingDetailModal = ({
  isOpen,
  onClose,
  booking,
  onUpdateStatus,
}: BookingDetailModalProps) => {
  if (!isOpen || !booking) return null;

  const handleConfirm = () => {
    onUpdateStatus?.(booking.id, 'confirmed');
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      onUpdateStatus?.(booking.id, 'cancelled');
    }
  };

  const handleComplete = () => {
    onUpdateStatus?.(booking.id, 'completed');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 bg-white">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-slate-800">
                  Booking Details
                </h2>
                <StatusBadge status={booking.status} />
              </div>
              <p className="text-sm text-slate-500 font-mono">
                {booking.bookingNumber}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 -m-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 rounded-xl transition-all duration-200"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="px-6 py-5 space-y-5">
            <div className="flex items-start gap-4">
              <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <User className="size-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Customer
                </p>
                <p className="text-base font-semibold text-slate-800">
                  {booking.customer.name}
                </p>
                {booking.customer.department && (
                  <p className="text-sm text-slate-500">
                    {booking.customer.department}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="size-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
                <MapPin className="size-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Room
                </p>
                <p className="text-base font-semibold text-slate-800">
                  {booking.room.name}
                </p>
                <p className="text-sm text-slate-500">
                  {booking.room.building}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="size-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                <Calendar className="size-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Schedule
                </p>
                <p className="text-base font-semibold text-slate-800">
                  {booking.scheduleDate}
                </p>
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  <Clock className="size-3.5" />
                  {booking.startTime} - {booking.endTime}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="size-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="size-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Total Amount
                </p>
                <p className="text-2xl font-bold text-slate-800">
                  {formatVND(booking.amount)}
                </p>
              </div>
            </div>
          </div>

          {booking.status !== 'completed' && booking.status !== 'cancelled' && (
            <div className="px-6 py-4 bg-slate-50 border-t border-gray-100 flex items-center justify-end gap-3">
              {booking.status === 'pending' && (
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  Confirm Booking
                </button>
              )}
              {booking.status === 'confirmed' && (
                <button
                  onClick={handleComplete}
                  className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Mark Complete
                </button>
              )}
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-100 transition-colors"
              >
                Cancel Booking
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;
