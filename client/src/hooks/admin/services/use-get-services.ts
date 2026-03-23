import { useQuery } from '@tanstack/react-query';
import { adminServicesApi } from '@/apis/admin/services.api';

export const useGetServices = () => {
  return useQuery({
    queryKey: ['services', 'list'],
    queryFn: async () => {
      return adminServicesApi.list();
    },
  });
};
