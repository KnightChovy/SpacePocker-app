import type { BookingDistribution, ChartDataItem, StatItem } from '@/types/user/types';

export const dashboardService = {
  getStats: async (): Promise<StatItem[]> => {
    return [
      { label: 'Total Bookings', value: 0, type: 'bookings' },
      { label: 'Revenue', value: 0, type: 'revenue' },
      { label: 'Occupancy', value: '0%', type: 'occupancy' },
      { label: 'Inquiries', value: 0, type: 'inquiries' },
    ];
  },

  getRevenueData: async (): Promise<ChartDataItem[]> => {
    return [
      { name: 'Mon', value: 0 },
      { name: 'Tue', value: 0 },
      { name: 'Wed', value: 0 },
      { name: 'Thu', value: 0 },
      { name: 'Fri', value: 0 },
      { name: 'Sat', value: 0 },
      { name: 'Sun', value: 0 },
    ];
  },

  getRoomTypeDistribution: async (): Promise<BookingDistribution[]> => {
    return [
      { roomType: 'MEETING', booked: 0, available: 0 },
      { roomType: 'CLASSROOM', booked: 0, available: 0 },
      { roomType: 'EVENT', booked: 0, available: 0 },
    ];
  },
};
