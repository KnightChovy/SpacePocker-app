import { Calendar, Clock, Check, X } from 'lucide-react';
import type {
  BookingRequestForManager,
  BookingRequestStatus,
} from '@/types/user/booking-request-api';

interface BookingTableProps {
  requests: BookingRequestForManager[];
  onApprove?: (request: BookingRequestForManager) => void | Promise<void>;
  onReject?: (request: BookingRequestForManager) => void | Promise<void>;
  onCancel?: (request: BookingRequestForManager) => void | Promise<void>;
  isApproving?: boolean;
  isRejecting?: boolean;
  isCancelling?: boolean;
}

const StatusBadge = ({ status }: { status: BookingRequestStatus }) => {
  const config: Record<BookingRequestStatus, { bg: string; text: string }> = {
    APPROVED: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    PENDING: { bg: 'bg-amber-50', text: 'text-amber-600' },
    COMPLETED: { bg: 'bg-blue-50', text: 'text-blue-600' },
    CANCELLED: { bg: 'bg-red-50', text: 'text-red-400' },
    REJECTED: { bg: 'bg-red-50', text: 'text-red-600' },
    CHECKED_IN: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
  };

  const { bg, text } = config[status];

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}
    >
      {status}
    </span>
  );
};

const BookingTable = ({
  requests,
  onApprove,
  onReject,
  onCancel,
  isApproving,
  isRejecting,
  isCancelling,
}: BookingTableProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-250">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">
                Request ID
              </th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Room
              </th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Time
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
            {requests.map(request => (
              <tr
                key={request.id}
                className="group hover:bg-primary/5 transition-colors"
              >
                <td className="py-4 px-6 text-xs font-mono text-text-gray font-medium">
                  {request.id}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                      {request.user?.name
                        ? request.user.name
                            .split(' ')
                            .map(n => n[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase()
                        : 'U'}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-text-dark">
                        {request.user?.name}
                      </div>
                      <div className="text-xs text-text-gray">
                        {request.user?.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm font-medium text-text-dark">
                    {request.room?.name}
                  </div>
                  <div className="text-xs text-text-gray">
                    {request.room?.roomCode}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5 text-sm text-text-dark">
                      <Calendar className="size-3.5 text-gray-400" />
                      {new Date(request.startTime).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-text-gray">
                      <Clock className="size-3.5 text-gray-400" />
                      {new Date(request.startTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      -{' '}
                      {new Date(request.endTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <StatusBadge status={request.status} />
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {request.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => onApprove?.(request)}
                          className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                          title="Approve"
                          disabled={isApproving || isRejecting}
                        >
                          <Check className="size-4" />
                        </button>
                        <button
                          onClick={() => onReject?.(request)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                          title="Reject"
                          disabled={isApproving || isRejecting}
                        >
                          <X className="size-4" />
                        </button>
                      </>
                    )}

                    {(request.status === 'APPROVED' || (request.status === 'COMPLETED' && !request.checkInRecord)) && (
                      <button
                        onClick={() => onCancel?.(request)}
                        className="px-2.5 py-1 text-xs font-medium text-red-500 border border-red-200 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="Cancel"
                        disabled={isApproving || isRejecting || isCancelling}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
        <span className="text-xs text-gray-500">
          Showing{' '}
          <span className="font-bold text-text-dark">1-{requests.length}</span>{' '}
          requests
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
