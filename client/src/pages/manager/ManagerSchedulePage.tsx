import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Bell, MessageSquare } from 'lucide-react';
import AppHeader from '@/components/layouts/AppHeader';
import ScheduleFilterPanel from '@/components/features/manager/scheduleManager/ScheduleFilterPanel';
import ScheduleTimeline from '@/components/features/manager/scheduleManager/ScheduleTimeline';
import { scheduleService } from '@/services/scheduleService';
import type { Building } from '@/types/types';

const ManagerSchedulePage = () => {
  const { setSidebarOpen } = useOutletContext<{ setSidebarOpen: (open: boolean) => void }>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Whiteboard',
  ]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Fetch buildings on mount
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        setIsLoading(true);
        const data = await scheduleService.getBuildings();
        setBuildings(data);
      } catch (error) {
        console.error('Failed to fetch buildings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuildings();
  }, []);

  const handleBuildingChange = (buildingId: string, checked: boolean) => {
    setBuildings(prev =>
      prev.map(b => (b.id === buildingId ? { ...b, checked } : b))
    );
  };

  const handleAmenityChange = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  if (isLoading) {
    return (
      <>
        <AppHeader
          title="Schedule Management"
          onMenuClick={() => setSidebarOpen(true)}
          actions={headerActions}
          profile={{
            name: 'Alex Morgan',
            subtitle: 'Manager',
            avatarUrl: 'https://picsum.photos/id/64/100/100',
            showDropdown: true,
          }}
        />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-slate-500">Loading schedule...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader
        title="Schedule Management"
        onMenuClick={() => setSidebarOpen(true)}
        actions={headerActions}
        profile={{
          name: 'Alex Morgan',
          subtitle: 'Manager',
          avatarUrl: 'https://picsum.photos/id/64/100/100',
          showDropdown: true,
        }}
      />
      <div className="flex flex-1 overflow-hidden p-4 lg:p-6 gap-6 h-full">
      <ScheduleFilterPanel
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        buildings={buildings}
        onBuildingChange={handleBuildingChange}
        selectedAmenities={selectedAmenities}
        onAmenityChange={handleAmenityChange}
      />
      <ScheduleTimeline
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
    </div>
    </>
  );
};

export default ManagerSchedulePage;
