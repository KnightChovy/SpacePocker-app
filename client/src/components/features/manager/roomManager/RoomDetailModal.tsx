import { useMemo } from 'react';
import {
  X,
  Building2,
  Users,
  DollarSign,
  Ruler,
  Hash,
  Tags,
  Image,
} from 'lucide-react';
import { useGetRoomById } from '@/hooks/manager/rooms/use-get-room-by-id';
import type { ApiRoomStatus } from '@/types/user/room-api';
import { formatVND } from '@/lib/utils';

interface RoomDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string | null;
  buildings?: Array<{ id: string; name: string }>;
}

const StatusBadge = ({ status }: { status: ApiRoomStatus }) => {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    AVAILABLE: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      label: 'Available',
    },
    PROCESS: { bg: 'bg-blue-50', text: 'text-blue-600', label: 'Processing' },
    MAINTAIN: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      label: 'Maintenance',
    },
    UNAVAILABLE: {
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      label: 'Unavailable',
    },
  };

  const statusConfig = config[status] || config['AVAILABLE'];
  const { bg, text, label } = statusConfig;

  return (
    <span
      className={`px-3 py-1.5 rounded-full text-sm font-medium ${bg} ${text}`}
    >
      {label}
    </span>
  );
};

const RoomDetailModal = ({
  isOpen,
  onClose,
  roomId,
  buildings = [],
}: RoomDetailModalProps) => {
  const { data: room, isLoading } = useGetRoomById(roomId ?? undefined);

  const buildingName = useMemo(() => {
    if (room?.building?.buildingName) return room.building.buildingName;
    if (!room?.buildingId) return '';
    return (
      buildings.find(b => b.id === room.buildingId)?.name || room.buildingId
    );
  }, [buildings, room?.building?.buildingName, room?.buildingId]);

  const amenityNames = useMemo(() => {
    return (room?.amenities ?? [])
      .map(a => a.amenity?.name)
      .filter(Boolean) as string[];
  }, [room?.amenities]);

  const serviceCategoryNames = useMemo(() => {
    return (room?.serviceCategories ?? [])
      .map(category => category.category?.name)
      .filter(Boolean) as string[];
  }, [room?.serviceCategories]);

  if (!isOpen || !roomId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 bg-white">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-slate-800">
                  Room Details
                </h2>
                {!isLoading && room && <StatusBadge status={room.status} />}
              </div>
              <p className="text-sm text-slate-500">
                {isLoading ? 'Loading…' : room?.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 -m-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 rounded-xl transition-all duration-200"
            >
              <X className="size-5" />
            </button>
          </div>

          {isLoading ? (
            <div className="px-6 py-10">
              <div className="flex items-center justify-center">
                <div className="animate-spin size-8 border-3 border-primary border-t-transparent rounded-full" />
              </div>
            </div>
          ) : !room ? (
            <div className="px-6 py-10 text-sm text-slate-500">
              Room not found.
            </div>
          ) : (
            <div className="px-6 py-5 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Building2 className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Building
                    </p>
                    <p className="text-base font-semibold text-slate-800">
                      {buildingName}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-full bg-slate-50 text-slate-700 flex items-center justify-center">
                    <Hash className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Room Code
                    </p>
                    <p className="text-base font-semibold text-slate-800 font-mono">
                      {room.roomCode}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Users className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Capacity
                    </p>
                    <p className="text-base font-semibold text-slate-800">
                      {room.capacity} people
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                    <DollarSign className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Price
                    </p>
                    <p className="text-base font-semibold text-slate-800">
                      {formatVND(room.pricePerHour)}/hr
                    </p>
                    {room.securityDeposit != null && (
                      <p className="text-sm text-slate-500">
                        Deposit: {formatVND(room.securityDeposit)}
                      </p>
                    )}
                  </div>
                </div>

                {room.area != null && (
                  <div className="flex items-start gap-3">
                    <div className="size-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
                      <Ruler className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Area
                      </p>
                      <p className="text-base font-semibold text-slate-800">
                        {room.area} m²
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center">
                    <Tags className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Type
                    </p>
                    <p className="text-base font-semibold text-slate-800">
                      {room.roomType}
                    </p>
                    <p className="text-sm text-slate-500">
                      Available for booking:{' '}
                      {room.status === 'AVAILABLE' ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </div>

              {room.description && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Description
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {room.description}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Amenities
                </p>
                {amenityNames.length === 0 ? (
                  <p className="text-sm text-slate-500">No amenities.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {amenityNames.map(name => (
                      <span
                        key={name}
                        className="px-3 py-1 rounded-full bg-slate-50 text-slate-700 text-sm"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Service Categories
                </p>
                {serviceCategoryNames.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No service categories.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {serviceCategoryNames.map(name => (
                      <span
                        key={name}
                        className="px-3 py-1 rounded-full bg-primary/8 text-primary text-sm"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Image className="size-4 text-slate-400" />
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Images
                  </p>
                </div>
                {!room.images || room.images.length === 0 ? (
                  <p className="text-sm text-slate-500">No images.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {room.images.map((imageUrl, index) => (
                      <a
                        key={`${imageUrl}-${index}`}
                        href={imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="group block overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                      >
                        <img
                          src={imageUrl}
                          alt={`${room.name} ${index + 1}`}
                          className="h-28 w-full object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="px-6 py-4 bg-slate-50 border-t border-gray-100 flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailModal;
