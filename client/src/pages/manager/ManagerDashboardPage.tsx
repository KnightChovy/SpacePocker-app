import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Calendar, ChevronDown } from 'lucide-react';
import type {
  StatItem,
  ChartDataItem,
  BookingDistribution,
} from '@/types/user/types';
import {
  dashboardService,
  type PaidRange,
  type BookingReportMetadata,
} from '@/services/dashboardService';
import AppHeader from '@/components/layouts/AppHeader';
import { StatsGrid } from '@/components/features/manager/dashboardManager/StartsGrid';
import { RevenueOverview } from '@/components/features/manager/dashboardManager/RevenueOverview';
import { RoomTypeDistribution } from '@/components/features/manager/dashboardManager/RoomTypeDistribution';
import { QuickActions } from '@/components/features/manager/dashboardManager/QuickActions';
import { useAuthStore } from '@/stores/auth.store';
import { getAvatarUrl } from '@/lib/utils';

const PAID_RANGE_LABEL: Record<PaidRange, string> = {
  '3m': 'Last 3 Months',
  '30d': 'Last 30 Days',
  '7d': 'Last 7 Days',
};

const ManagerDashboardPage = () => {
  const { setSidebarOpen } = useOutletContext<{
    setSidebarOpen: (open: boolean) => void;
  }>();
  const user = useAuthStore(state => state.user);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [revenueData, setRevenueData] = useState<ChartDataItem[]>([]);
  const [roomTypeDistribution, setRoomTypeDistribution] = useState<
    BookingDistribution[]
  >([]);
  const [bookingReport, setBookingReport] =
    useState<BookingReportMetadata | null>(null);
  const [revenueTotal, setRevenueTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [paidRange, setPaidRange] = useState<PaidRange>('30d');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [statsData, revenueRes, distributionRes, bookingReportRes] =
          await Promise.all([
            dashboardService.getStats(),
            dashboardService.getRevenueReportData({
              paidRange,
              managerId: user?.id,
            }),
            dashboardService.getRoomTypeDistribution(),
            dashboardService.getBookingReportData({
              paidRange,
              managerId: user?.id,
            }),
          ]);

        setStats(statsData);
        setRevenueData(revenueRes.chartData);
        setRevenueTotal(revenueRes.totalRevenue);
        setRoomTypeDistribution(distributionRes);
        setBookingReport(bookingReportRes);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setRevenueData([]);
        setRevenueTotal(0);
        setBookingReport(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [paidRange, user?.id]);

  if (isLoading) {
    return (
      <>
        <AppHeader
          title="Dashboard"
          onMenuClick={() => setSidebarOpen(true)}
          showSearch={true}
          searchPlaceholder="Search bookings..."
          profile={{
            name: user?.name || 'Manager',
            subtitle: user?.role || 'MANAGER',
            avatarUrl: getAvatarUrl(user?.name, 'Manager'),
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
        showSearch={false}
        searchPlaceholder="Search bookings..."
        profile={{
          name: user?.name || 'Manager',
          subtitle: user?.role || 'MANAGER',
          avatarUrl: getAvatarUrl(user?.name, 'Manager'),
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
                Welcome back, {user?.name?.split(' ')[0] || 'Manager'}. Here's
                what's happening today.
              </p>
            </div>
            <div className="relative">
              <Calendar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
              <select
                value={paidRange}
                onChange={e => setPaidRange(e.target.value as PaidRange)}
                className="appearance-none flex items-center gap-2 text-sm text-slate-500 bg-white pl-10 pr-10 py-1.5 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
              >
                <option value="3m">{PAID_RANGE_LABEL['3m']}</option>
                <option value="30d">{PAID_RANGE_LABEL['30d']}</option>
                <option value="7d">{PAID_RANGE_LABEL['7d']}</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
            </div>
          </div>

          <StatsGrid
            stats={stats}
            paidRange={paidRange}
            revenueTotal={revenueTotal}
            bookingReport={bookingReport}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <RevenueOverview
                data={revenueData}
                paidRange={paidRange}
                totalRevenue={revenueTotal}
              />
              <RoomTypeDistribution data={roomTypeDistribution} />
            </div>

            <div className="flex flex-col gap-6">
              <QuickActions />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManagerDashboardPage;
