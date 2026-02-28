import type {
  StatItem,
  Activity,
  ChartDataItem,
  BookingDistribution,
  User,
} from '@/types/types';
import {
  stats,
  revenueData,
  roomTypeDistribution,
  activities,
  currentUser,
} from '@/data/constantManager';

export interface DashboardStatsResponse {
  data: StatItem[];
}

export interface RevenueDataResponse {
  data: ChartDataItem[];
}

export interface RoomDistributionResponse {
  data: BookingDistribution[];
}

export interface ActivitiesResponse {
  data: Activity[];
}

export interface CurrentUserResponse {
  data: User;
}

export interface DashboardFilterParams {
  dateRange?: {
    from: Date;
    to: Date;
  };
  building?: string;
}

export const dashboardService = {
  // TODO: Replace mock data with actual API calls
  // Example: return axiosInstance.get('/api/manager/stats', { params }).then(res => res.data);

  getStats: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _params?: DashboardFilterParams
  ): Promise<StatItem[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    return stats;
  },

  getRevenueData: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _params?: DashboardFilterParams
  ): Promise<ChartDataItem[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    return revenueData;
  },

  getRoomTypeDistribution: async (): Promise<BookingDistribution[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    return roomTypeDistribution;
  },

  getActivities: async (limit?: number): Promise<Activity[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    return limit ? activities.slice(0, limit) : activities;
  },

  getCurrentUser: async (): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 200));

    return currentUser;
  },
};

export default dashboardService;
