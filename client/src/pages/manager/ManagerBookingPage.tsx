import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Plus,
  Search,
  Building2,
  ChevronDown,
  Bell,
  MessageSquare,
} from 'lucide-react';
import AppHeader from '@/components/layouts/AppHeader';
import BookingTable from '../../components/features/manager/bookingManager/BookingTable';
import AddBookingModal from '../../components/features/manager/bookingManager/AddBookingModal';
import BookingDetailModal from '../../components/features/manager/bookingManager/BookingDetailModal';
import { bookingService } from '../../services/bookingService';
import type { Booking, BookingStatus } from '../../types/types';

const ManagerBookingPage: React.FC = () => {
  const { setSidebarOpen } = useOutletContext<{
    setSidebarOpen: (open: boolean) => void;
  }>();

  const headerActions = [
    {
      id: 'new-booking',
      icon: <Plus className="h-5 w-5" />,
      label: 'New Booking',
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

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await bookingService.getAllBookings({
        search: searchQuery || undefined,
        status:
          selectedStatus !== 'all'
            ? (selectedStatus as BookingStatus)
            : undefined,
        building: selectedBuilding !== 'all' ? selectedBuilding : undefined,
      });
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedStatus, selectedBuilding]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleAddBooking = async (data: {
    customerName: string;
    customerDepartment: string;
    roomId: string;
    scheduleDate: string;
    startTime: string;
    endTime: string;
    amount: string;
  }) => {
    try {
      const roomMap: Record<string, { name: string; building: string }> = {
        r1: { name: 'Lab 305', building: 'Science Building' },
        r2: { name: 'Studio 4', building: 'Arts Center' },
        r3: { name: 'Room A-101', building: 'Science Building' },
        r4: { name: 'Auditorium', building: 'Main Hall' },
      };
      const room = roomMap[data.roomId] || {
        name: 'Unknown',
        building: 'Unknown',
      };

      await bookingService.createBooking({
        customerId: Date.now().toString(),
        customerName: data.customerName,
        customerDepartment: data.customerDepartment,
        roomId: data.roomId,
        roomName: room.name,
        roomBuilding: room.building,
        scheduleDate: data.scheduleDate,
        startTime: data.startTime,
        endTime: data.endTime,
        amount: parseFloat(data.amount),
      });
      fetchBookings();
    } catch (error) {
      console.error('Failed to create booking:', error);
    }
  };

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const handleEditBooking = (booking: Booking) => {
    console.log('Edit booking:', booking);
  };

  const handleCancelBooking = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingService.cancelBooking(id);
        fetchBookings();
      } catch (error) {
        console.error('Failed to cancel booking:', error);
      }
    }
  };

  const handleUpdateStatus = async (id: string, status: BookingStatus) => {
    try {
      await bookingService.updateBookingStatus(id, status);
      fetchBookings();
      setIsDetailModalOpen(false);
    } catch (error) {
      console.error('Failed to update booking status:', error);
    }
  };

  const buildings = [...new Set(bookings.map(b => b.room.building))];

  return (
    <>
      <AppHeader
        title="Bookings Management"
        subtitle="Monitor reservation status, schedules, and billing details."
        onMenuClick={() => setSidebarOpen(true)}
        actions={headerActions}
        profile={{
          name: 'Alex Morgan',
          subtitle: 'Manager',
          avatarUrl: 'https://picsum.photos/id/64/100/100',
          showDropdown: true,
        }}
      />
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8 custom-scrollbar relative">
        <div className="max-w-300 mx-auto w-full">
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div className="relative">
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
            </div>

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
          </div>

          <div className="pb-20">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin size-8 border-3 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              <BookingTable
                bookings={bookings}
                onView={handleViewBooking}
                onEdit={handleEditBooking}
                onCancel={handleCancelBooking}
              />
            )}
          </div>
        </div>

        <AddBookingModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddBooking}
        />

        <BookingDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          booking={selectedBooking}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>
    </>
  );
};

export default ManagerBookingPage;
