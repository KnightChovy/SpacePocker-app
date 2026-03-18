import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { useAuthStore } from '@/stores/auth.store';
import type {
  BookingRequestForManager,
  BookingRequestStatus,
} from '@/types/booking-request-api';

export const useGetBookingRequestsForManager = (
  status?: BookingRequestStatus
) => {
  const role = useAuthStore(state => state.user?.role);

  return useQuery({
    queryKey: ['booking-requests', role ?? 'UNKNOWN', status ?? 'ALL'],
    queryFn: async () => {
      const isAdmin = role === 'ADMIN';
      const response = await axiosInstance.get<{
        metadata: BookingRequestForManager[];
      }>(
        isAdmin ? '/allBookingRequest' : '/booking-requests',
        isAdmin
          ? undefined
          : {
              params: {
                ...(status ? { status } : {}),
              },
            }
      );

      const requests = response.data.metadata ?? [];
      if (isAdmin && status) {
        return requests.filter(request => request.status === status);
      }

      return requests;
    },
  });
};
