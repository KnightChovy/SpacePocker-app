import { Calendar, Clock, Eye, Edit, X } from 'lucide-react';
import type { Booking, BookingStatus } from '@/types/types';
import { BookingStatusLabel } from '@/types/types';

interface BookingTableProps {
  bookings: Booking[];
  onView?: (booking: Booking) => void;
  onEdit?: (booking: Booking) => void;
  onCancel?: (id: string) => void;
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
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}
    >
      {label}
    </span>
  );
};

const BookingTable = ({
  bookings,
  onView,
  onEdit,
  onCancel,
}: BookingTableProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-250">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">
                Booking ID
              </th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Room
              </th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Schedule
              </th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                Amount
              </th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-32">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map(booking => (
              <tr
                key={booking.id}
                className="group hover:bg-primary/5 transition-colors"
              >
                <td className="py-4 px-6 text-xs font-mono text-text-gray font-medium">
                  {booking.bookingNumber}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    {booking.customer.avatar ? (
                      <img
                        src={booking.customer.avatar}
                        alt={booking.customer.name}
                        className="size-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="size-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                        {booking.customer.initials}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-semibold text-text-dark">
                        {booking.customer.name}
                      </div>
                      <div className="text-xs text-text-gray">
                        {booking.customer.department}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm font-medium text-text-dark">
                    {booking.room.name}
                  </div>
                  <div className="text-xs text-text-gray">
                    {booking.room.building}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-col gap-0.5">
                    <div
                      className={`flex items-center gap-1.5 text-sm ${booking.status === 'completed' ? 'text-text-gray line-through' : 'text-text-dark'}`}
                    >
                      <Calendar className="size-3.5 text-gray-400" />
                      {booking.scheduleDate}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-text-gray">
                      <Clock className="size-3.5 text-gray-400" />
                      {booking.startTime} - {booking.endTime}
                    </div>
                  </div>
                </td>
                <td
                  className={`py-4 px-6 text-right font-mono text-sm font-bold ${booking.status === 'cancelled' ? 'text-gray-400 line-through' : 'text-text-dark'}`}
                >
                  ${booking.amount.toFixed(2)}
                </td>
                <td className="py-4 px-6">
                  <StatusBadge status={booking.status} />
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onView?.(booking)}
                      className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded transition-colors"
                      title="View Details"
                    >
                      <Eye className="size-4" />
                    </button>
                    {booking.status !== 'completed' &&
                      booking.status !== 'cancelled' && (
                        <>
                          <button
                            onClick={() => onEdit?.(booking)}
                            className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-gray-100 rounded transition-colors"
                            title="Edit Booking"
                          >
                            <Edit className="size-4" />
                          </button>
                          <button
                            onClick={() => onCancel?.(booking.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded transition-colors"
                            title="Cancel Booking"
                          >
                            <X className="size-4" />
                          </button>
                        </>
                      )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Pagination Info */}
      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
        <span className="text-xs text-gray-500">
          Showing{' '}
          <span className="font-bold text-text-dark">1-{bookings.length}</span>{' '}
          of <span className="font-bold text-text-dark">48</span> bookings
        </span>
        <div className="flex gap-2">
          <button
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            disabled
          >
            Previous
          </button>
          <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-text-dark hover:bg-gray-50 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingTable;
