import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Calendar, ChevronDown, Bell, MessageSquare } from 'lucide-react';
import type {
  StatItem,
  ChartDataItem,
  BookingDistribution,
  Activity,
} from '@/types/types';
import { dashboardService } from '@/services/dashboardService';
import AppHeader from '@/components/layouts/AppHeader';
import { StatsGrid } from '@/components/features/manager/dashboardManager/StartsGrid';
import { RevenueOverview } from '@/components/features/manager/dashboardManager/RevenueOverview';
import { RoomTypeDistribution } from '@/components/features/manager/dashboardManager/RoomTypeDistribution';
import { QuickActions } from '@/components/features/manager/dashboardManager/QuickActions';
import { RecentActivity } from '@/components/features/manager/dashboardManager/RecentActivity';

const ManagerDashboardPage = () => {
  const { setSidebarOpen } = useOutletContext<{ setSidebarOpen: (open: boolean) => void }>();
  const [stats, setStats] = useState<StatItem[]>([]);
  const [revenueData, setRevenueData] = useState<ChartDataItem[]>([]);
  const [roomTypeDistribution, setRoomTypeDistribution] = useState<
    BookingDistribution[]
  >([]);
  const [activities, setActivities] = useState<Activity[]>([]);
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [statsData, revenueRes, distributionRes, activitiesRes] =
          await Promise.all([
            dashboardService.getStats(),
            dashboardService.getRevenueData(),
            dashboardService.getRoomTypeDistribution(),
            dashboardService.getActivities(),
          ]);

        setStats(statsData);
        setRevenueData(revenueRes);
        setRoomTypeDistribution(distributionRes);
        setActivities(activitiesRes);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <>
        <AppHeader
          title="Dashboard"
          onMenuClick={() => setSidebarOpen(true)}
          showSearch={true}
          searchPlaceholder="Search bookings..."
          actions={headerActions}
          profile={{
            name: 'Alex Morgan',
            subtitle: 'Manager',
            avatarUrl: 'https://picsum.photos/id/64/100/100',
            showDropdown: true,
          }}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-slate-500">Loading dashboard...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader
        title="Dashboard"
        onMenuClick={() => setSidebarOpen(true)}
        showSearch={true}
        searchPlaceholder="Search bookings..."
        actions={headerActions}
        profile={{
          name: 'Alex Morgan',
          subtitle: 'Manager',
          avatarUrl: 'https://picsum.photos/id/64/100/100',
          showDropdown: true,
        }}
      />
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8 custom-scrollbar relative">
      <div className="max-w-350 mx-auto w-full pb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Dashboard Overview
            </h2>
            <p className="text-slate-500 mt-1">
              Welcome back, Alex. Here's what's happening today.
            </p>
          </div>
          <button className="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
            <Calendar className="size-4" />
            <span>Last 30 Days</span>
            <ChevronDown className="size-4" />
          </button>
        </div>

        <StatsGrid stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <RevenueOverview data={revenueData} />
            <RoomTypeDistribution data={roomTypeDistribution} />
          </div>

          <div className="flex flex-col gap-6">
            <QuickActions />
            <RecentActivity activities={activities} />
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ManagerDashboardPage;
