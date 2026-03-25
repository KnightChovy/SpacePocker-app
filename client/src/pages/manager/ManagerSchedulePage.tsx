import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import AppHeader from '@/components/layouts/AppHeader';
import ScheduleFilterPanel from '@/components/features/manager/scheduleManager/ScheduleFilterPanel';
import ScheduleTimeline from '@/components/features/manager/scheduleManager/ScheduleTimeline';
import { useAuthStore } from '@/stores/auth.store';
import { getAvatarUrl } from '@/lib/utils';

const ManagerSchedulePage = () => {
  const { setSidebarOpen } = useOutletContext<{
    setSidebarOpen: (open: boolean) => void;
  }>();
  const user = useAuthStore(state => state.user);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  return (
    <>
      <AppHeader
        title="Schedule Management"
        showSearch={false}
        onMenuClick={() => setSidebarOpen(true)}
        profile={{
          name: user?.name || 'Manager',
          subtitle: user?.role || 'MANAGER',
          avatarUrl: getAvatarUrl(user?.name, 'Manager'),
          showDropdown: true,
        }}
      />
      <div className="flex flex-1 overflow-hidden p-4 lg:p-6 gap-6 h-full">
        <ScheduleFilterPanel
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
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
