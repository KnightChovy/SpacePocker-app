import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Building2,
  ChevronDown,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Bell,
  MessageSquare,
} from 'lucide-react';
import type { ApiRoom, ApiRoomStatus } from '@/types/room-api';
import { useGetRooms } from '@/hooks/manager/rooms/use-get-rooms';
import { useCreateRoom } from '@/hooks/manager/rooms/use-create-room';
import { useDeleteRoom } from '@/hooks/manager/rooms/use-delete-room';
import { useGetBuildings } from '@/hooks/manager/buildings/use-get-buildings';
import AppHeader from '@/components/layouts/AppHeader';
import AddRoomModal from '@/components/features/manager/roomManager/AddRoomModal';
import RoomDetailModal from '@/components/features/manager/roomManager/RoomDetailModal';
import EditRoomModal from '@/components/features/manager/roomManager/EditRoomModal';
import DeleteRoomConfirmModal from '@/components/features/manager/roomManager/DeleteRoomConfirmModal';
import { useAuthStore } from '@/stores/auth.store';
import { getAvatarUrl } from '@/lib/utils';

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
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}
    >
      {label}
    </span>
  );
};

const RoomRow = ({
  room,
  onEdit,
  onDelete,
  onView,
}: {
  room: ApiRoom;
  onEdit: (room: ApiRoom) => void;
  onDelete: (id: string) => void;
  onView: (room: ApiRoom) => void;
}) => {
  const [showActions, setShowActions] = useState(false);
  const imageUrl =
    room.images?.[0] ||
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300';
  const buildingName = room.building?.buildingName || room.buildingId;

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <img
            src={imageUrl}
            alt={room.name}
            className="size-12 rounded-lg object-cover"
          />
          <div>
            <p className="font-semibold text-text-dark">{room.name}</p>
            <p className="text-xs text-text-gray">{buildingName}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <span className="text-sm text-text-dark">{room.roomType}</span>
      </td>
      <td className="py-4 px-4">
        <span className="text-sm text-text-dark">{room.capacity} people</span>
      </td>
      <td className="py-4 px-4">
        <span className="text-sm font-medium text-text-dark">
          ${room.pricePerHour}/hr
        </span>
      </td>
      <td className="py-4 px-4">
        <StatusBadge status={room.status} />
      </td>
      <td className="py-4 px-4">
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreHorizontal className="size-4 text-text-gray" />
          </button>

          {showActions && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowActions(false)}
              />
              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20 min-w-32">
                <button
                  onClick={() => {
                    onView(room);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-dark hover:bg-gray-50"
                >
                  <Eye className="size-4" />
                  View
                </button>
                <button
                  onClick={() => {
                    onEdit(room);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-dark hover:bg-gray-50"
                >
                  <Edit className="size-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(room.id);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="size-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

const ManagerRoomPage = () => {
  const { setSidebarOpen } = useOutletContext<{
    setSidebarOpen: (open: boolean) => void;
  }>();
  const user = useAuthStore(state => state.user);

  const headerActions = [
    {
      id: 'notifications',
      icon: <Bell className="h-5 w-5" />,
      badge: true,
    },
    {
      id: 'messages',
      icon: <MessageSquare className="h-5 w-5" />,
    },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<ApiRoomStatus | 'all'>(
    'all'
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewRoomId, setViewRoomId] = useState<string | null>(null);
  const [editRoomId, setEditRoomId] = useState<string | null>(null);
  const [deleteRoomId, setDeleteRoomId] = useState<string | null>(null);

  const roomQueryParams = useMemo(
    () => ({
      search: searchQuery || undefined,
      buildingId: selectedBuildingId !== 'all' ? selectedBuildingId : undefined,
      status: selectedStatus !== 'all' ? selectedStatus : undefined,
      limit: 100,
      offset: 0,
    }),
    [searchQuery, selectedBuildingId, selectedStatus]
  );

  const { data: roomList, isLoading } = useGetRooms(roomQueryParams);
  const rooms = roomList?.rooms ?? [];

  const { data: buildingList } = useGetBuildings({ limit: 100, offset: 0 });
  const buildings =
    buildingList?.buildings?.map(b => ({ id: b.id, name: b.buildingName })) ??
    [];

  const createRoomMutation = useCreateRoom();
  const deleteRoomMutation = useDeleteRoom();

  const generateRoomCode = (name: string) => {
    const slug = name
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 20);
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `${slug || 'ROOM'}-${rand}`;
  };

  const handleAddRoom = () => {
    setIsAddModalOpen(true);
  };

  const handleAddRoomSubmit = async (data: {
    name: string;
    description: string;
    buildingId: string;
    roomType: 'MEETING' | 'CLASSROOM' | 'EVENT' | 'OTHER';
    status: ApiRoomStatus;
    capacity: string;
    area: string;
    pricePerHour: string;
    securityDeposit: string;
    roomCode: string;
    imageUrls: string[];
    amenityIds: string[];
    serviceCategoryIds: string[];
  }) => {
    try {
      const normalizedRoomCode = data.roomCode?.trim();
      await createRoomMutation.mutateAsync({
        name: data.name,
        buildingId: data.buildingId,
        capacity: parseInt(data.capacity, 10),
        description: data.description?.trim() || undefined,
        pricePerHour: parseFloat(data.pricePerHour),
        securityDeposit:
          data.securityDeposit?.trim() === ''
            ? undefined
            : parseFloat(data.securityDeposit),
        roomType: data.roomType,
        status: data.status,
        area: data.area?.trim() === '' ? undefined : parseFloat(data.area),
        roomCode: normalizedRoomCode || generateRoomCode(data.name),
        images: data.imageUrls,
        amenities: data.amenityIds,
        serviceCategories: data.serviceCategoryIds,
      });

      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  const handleEditRoom = (room: ApiRoom) => {
    setEditRoomId(room.id);
  };

  const handleDeleteRoom = async (id: string) => {
    setDeleteRoomId(id);
  };

  const handleViewRoom = (room: ApiRoom) => {
    setViewRoomId(room.id);
  };

  return (
    <>
      <AppHeader
        title="Room Management"
        subtitle="Manage inventory, pricing, and availability across all buildings."
        onMenuClick={() => setSidebarOpen(true)}
        actions={headerActions}
        profile={{
          name: user?.name || 'Manager',
          subtitle: user?.role || 'MANAGER',
          avatarUrl: getAvatarUrl(user?.name, 'Manager'),
          showDropdown: true,
        }}
      />
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8 custom-scrollbar">
        <div className="max-w-300 mx-auto w-full pb-10">
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div className="relative">
              <select
                value={selectedBuildingId}
                onChange={e => setSelectedBuildingId(e.target.value)}
                className="appearance-none pl-10 pr-8 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
              >
                <option value="all">All Buildings</option>
                {buildings.map(building => (
                  <option key={building.id} value={building.id}>
                    {building.name}
                  </option>
                ))}
              </select>
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedStatus}
                onChange={e =>
                  setSelectedStatus(e.target.value as ApiRoomStatus | 'all')
                }
                className="appearance-none pl-10 pr-8 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="AVAILABLE">Available</option>
                <option value="UNAVAILABLE">Unavailable</option>
                <option value="PROCESS">Processing</option>
                <option value="MAINTAIN">Maintenance</option>
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Add Room button in filter bar */}
            <button
              onClick={handleAddRoom}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 shadow-sm shadow-primary/20 transition-all active:scale-95 ml-auto"
            >
              <Plus className="size-4" />
              Add Room
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-soft overflow-visible">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin size-8 border-3 border-primary border-t-transparent rounded-full" />
              </div>
            ) : rooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Building2 className="size-12 mb-3" />
                <p className="text-lg font-medium">No rooms found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-gray uppercase tracking-wider">
                      Room
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-gray uppercase tracking-wider">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-gray uppercase tracking-wider">
                      Capacity
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-gray uppercase tracking-wider">
                      Price
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-gray uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-gray uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map(room => (
                    <RoomRow
                      key={room.id}
                      room={room}
                      onEdit={handleEditRoom}
                      onDelete={handleDeleteRoom}
                      onView={handleViewRoom}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {!isLoading && rooms.length > 0 && (
            <div className="mt-4 text-sm text-text-gray">
              Showing {rooms.length} of{' '}
              {roomList?.pagination?.total ?? rooms.length} rooms
            </div>
          )}
        </div>

        <AddRoomModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddRoomSubmit}
          buildings={buildings}
        />

        <RoomDetailModal
          isOpen={Boolean(viewRoomId)}
          onClose={() => setViewRoomId(null)}
          roomId={viewRoomId}
          buildings={buildings}
        />

        <EditRoomModal
          isOpen={Boolean(editRoomId)}
          onClose={() => setEditRoomId(null)}
          roomId={editRoomId}
          buildings={buildings}
        />

        <DeleteRoomConfirmModal
          isOpen={Boolean(deleteRoomId)}
          onClose={() => setDeleteRoomId(null)}
          isLoading={deleteRoomMutation.isPending}
          roomName={
            deleteRoomId
              ? rooms.find(r => r.id === deleteRoomId)?.name
              : undefined
          }
          onConfirm={async () => {
            if (!deleteRoomId) return;
            try {
              await deleteRoomMutation.mutateAsync(deleteRoomId);
              setDeleteRoomId(null);
            } catch (error) {
              console.error('Failed to delete room:', error);
            }
          }}
        />
      </div>
    </>
  );
};

export default ManagerRoomPage;
