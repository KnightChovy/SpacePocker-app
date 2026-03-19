import { useQuery } from '@tanstack/react-query';
import { managerServiceCategoriesApi } from '@/apis/manager/service-categories.api';

export const useGetServiceCategoriesManager = () => {
  return useQuery({
    queryKey: ['service-categories', 'list'],
    queryFn: async () => {
      return managerServiceCategoriesApi.list();
    },
  });
};
