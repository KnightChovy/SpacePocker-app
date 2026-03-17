import { MoreVertical } from 'lucide-react';
import type { Room } from '@/types/types';
import { formatVND } from '@/lib/utils';

interface RoomTableProps {
  rooms: Room[];
}

type RoomStatus = 'available' | 'occupied' | 'maintenance';

const StatusBadge = ({ status }: { status: RoomStatus }) => {
  const config: Record<
    RoomStatus,
    { bg: string; text: string; label: string }
  > = {
    available: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      label: 'Available',
    },
    occupied: { bg: 'bg-amber-50', text: 'text-amber-600', label: 'Occupied' },
    maintenance: {
      bg: 'bg-red-50',
      text: 'text-red-400',
      label: 'Maintenance',
    },
  };

  const { bg, text, label } = config[status] || config.available;

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}
    >
      {label}
    </span>
  );
};

const RoomTable = ({ rooms }: RoomTableProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-75">
                Room Details
              </th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Building
              </th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                Capacity
              </th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                Price/hr
              </th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-20">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rooms.map(room => (
              <tr
                key={room.id}
                className="group hover:bg-primary/5 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={room.imageUrl}
                      alt={room.name}
                      className="w-12 h-12 rounded-lg object-cover shrink-0 border border-gray-200"
                    />
                    <div>
                      <div className="text-sm font-bold text-text-dark group-hover:text-primary transition-colors">
                        {room.name}
                      </div>
                      <div className="text-xs text-text-gray mt-0.5">
                        {room.category} • {room.location}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-text-gray">
                  {room.building}
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {room.capacity}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <StatusBadge status={room.status as RoomStatus} />
                </td>
                <td className="py-4 px-6 text-right font-mono text-sm font-bold text-text-dark">
                  {formatVND(room.pricePerHour)}
                </td>
                <td className="py-4 px-6 text-center">
                  <button className="text-gray-400 hover:text-primary p-1 rounded hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                    <MoreVertical className="size-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
        <span className="text-xs text-gray-500">
          Showing{' '}
          <span className="font-bold text-text-dark">1-{rooms.length}</span> of{' '}
          <span className="font-bold text-text-dark">12</span> rooms
        </span>
        <div className="flex gap-2">
          <button
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            disabled
          >
            Previous
          </button>
          <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-text-dark hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomTable;
