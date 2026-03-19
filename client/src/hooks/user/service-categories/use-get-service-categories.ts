import { useQuery } from '@tanstack/react-query';

import { userServiceCategoriesApi } from '@/apis/user/service-categories.api';

export const useGetServiceCategories = () => {
  return useQuery({
    queryKey: ['user', 'service-categories', 'list'],
    queryFn: async () => {
      return userServiceCategoriesApi.list();
    },
  });
};
