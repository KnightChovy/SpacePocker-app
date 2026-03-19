import { useQuery } from '@tanstack/react-query';
import { managerBookingRequestsApi } from '@/apis/manager/booking-requests.api';
import { useAuthStore } from '@/stores/auth.store';
import type {
  BookingRequestStatus,
} from '@/types/user/booking-request-api';

export const useGetBookingRequestsForManager = (
  status?: BookingRequestStatus
) => {
  const role = useAuthStore(state => state.user?.role);

  return useQuery({
    queryKey: ['booking-requests', role ?? 'UNKNOWN', status ?? 'ALL'],
    queryFn: async () => {
      return managerBookingRequestsApi.listForRole({ role, status });
    },
  });
};
