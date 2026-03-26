import { useQuery } from '@tanstack/react-query';

import {
  userFeedbackApi,
  type GetFeedbacksRequest,
} from '@/apis/user/feedback.api';

export const useGetFeedbacks = (params?: GetFeedbacksRequest) => {
  return useQuery({
    queryKey: [
      'user',
      'feedback',
      'list',
      params?.roomId,
      params?.page ?? 1,
      params?.limit ?? 10,
    ],
    enabled: Boolean(params?.roomId),
    queryFn: async () => {
      return userFeedbackApi.getFeedbacks(params as GetFeedbacksRequest);
    },
  });
};
