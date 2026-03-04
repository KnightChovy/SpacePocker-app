import { useState, useEffect, useCallback } from 'react';
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
import type { ManagerRoom } from '@/types/types';
import { roomService } from '@/services/roomService';
import AppHeader from '@/components/layouts/AppHeader';
import AddRoomModal from '@/components/features/manager/roomManager/AddRoomModal';

const StatusBadge = ({ status }: { status: ManagerRoom['status'] }) => {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    available: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      label: 'Available',
    },
    occupied: { bg: 'bg-blue-50', text: 'text-blue-600', label: 'Occupied' },
    maintenance: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      label: 'Maintenance',
    },
    active: { bg: 'bg-green-50', text: 'text-green-600', label: 'Active' },
    booked: { bg: 'bg-purple-50', text: 'text-purple-600', label: 'Booked' },
  };

  const statusConfig = config[status] || config['available'];
  const { bg, text, label } = statusConfig;

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}
    >
      {label}
    </span>
  );
};

// Room Row Component
const RoomRow = ({
  room,
  onEdit,
  onDelete,
  onView,
}: {
  room: ManagerRoom;
  onEdit: (room: ManagerRoom) => void;
  onDelete: (id: string) => void;
  onView: (room: ManagerRoom) => void;
}) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <img
            src={room.imageUrl}
            alt={room.name}
            className="size-12 rounded-lg object-cover"
          />
          <div>
            <p className="font-semibold text-text-dark">{room.name}</p>
            <p className="text-xs text-text-gray">{room.building}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <span className="text-sm text-text-dark">{room.type}</span>
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

// Main Page Component
const ManagerRoomPage = () => {
  const { setSidebarOpen } = useOutletContext<{ setSidebarOpen: (open: boolean) => void }>();
  
  const headerActions = [
    {
      id: 'add-room',
      icon: <Plus className="h-5 w-5" />,
      label: 'Add Room',
      variant: 'primary' as const,
      onClick: () => setIsAddModalOpen(true),
    },
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
  
  // State
  const [rooms, setRooms] = useState<ManagerRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch rooms
  const fetchRooms = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await roomService.getAllRooms({
        search: searchQuery || undefined,
        building: selectedBuilding !== 'all' ? selectedBuilding : undefined,
        status:
          selectedStatus !== 'all'
            ? (selectedStatus as ManagerRoom['status'])
            : undefined,
      });
      setRooms(data);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedBuilding, selectedStatus]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Handlers
  const handleAddRoom = () => {
    setIsAddModalOpen(true);
  };

  const handleAddRoomSubmit = async (data: {
    name: string;
    building: string;
    capacity: string;
    rate: string;
    isAvailable: boolean;
  }) => {
    try {
      const newRoom = await roomService.createRoom({
        name: data.name,
        building: data.building,
        type: 'Meeting Room',
        capacity: parseInt(data.capacity),
        pricePerHour: parseFloat(data.rate),
        status: data.isAvailable ? 'available' : 'maintenance',
        amenities: [],
      });
      setRooms(prev => [...prev, newRoom]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  const handleEditRoom = (room: ManagerRoom) => {
    // TODO: Open edit room modal
    console.log('Edit room:', room);
  };

  const handleDeleteRoom = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await roomService.deleteRoom(id);
        setRooms(prev => prev.filter(room => room.id !== id));
      } catch (error) {
        console.error('Failed to delete room:', error);
      }
    }
  };

  const handleViewRoom = (room: ManagerRoom) => {
    // TODO: Navigate to room detail or open modal
    console.log('View room:', room);
  };

  // Filter rooms
  const filteredRooms = rooms.filter(room => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.building.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBuilding =
      selectedBuilding === 'all' || room.building === selectedBuilding;
    const matchesStatus =
      selectedStatus === 'all' || room.status === selectedStatus;

    return matchesSearch && matchesBuilding && matchesStatus;
  });

  // Get unique buildings for filter
  const buildings = [...new Set(rooms.map(room => room.building))];

  return (
    <>
      <AppHeader
        title="Room Management"
        subtitle="Manage inventory, pricing, and availability across all buildings."
        onMenuClick={() => setSidebarOpen(true)}
        actions={headerActions}
        profile={{
          name: 'Alex Morgan',
          subtitle: 'Manager',
          avatarUrl: 'https://picsum.photos/id/64/100/100',
          showDropdown: true,
        }}
      />
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8 custom-scrollbar">
      <div className="max-w-300 mx-auto w-full pb-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Search */}
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

          {/* Building Filter */}
          <div className="relative">
            <select
              value={selectedBuilding}
              onChange={e => setSelectedBuilding(e.target.value)}
              className="appearance-none pl-10 pr-8 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
            >
              <option value="all">All Buildings</option>
              {buildings.map(building => (
                <option key={building} value={building}>
                  {building}
                </option>
              ))}
            </select>
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="appearance-none pl-10 pr-8 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-soft overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin size-8 border-3 border-primary border-t-transparent rounded-full" />
            </div>
          ) : filteredRooms.length === 0 ? (
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
                {filteredRooms.map(room => (
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

        {/* Summary */}
        {!isLoading && filteredRooms.length > 0 && (
          <div className="mt-4 text-sm text-text-gray">
            Showing {filteredRooms.length} of {rooms.length} rooms
          </div>
        )}
      </div>

      {/* Add Room Modal */}
      <AddRoomModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddRoomSubmit}
      />
    </div>
    </>
  );
};

export default ManagerRoomPage;
