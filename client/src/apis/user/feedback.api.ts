import axiosInstance from '@/lib/axios';
import type { ApiResponse } from '@/apis/api.types';

import type {
  CreateFeedbackRequest,
  CreateFeedbackResponse,
  GetFeedbacksRequest,
  GetFeedbacksResult,
} from '@/types/user/feedback.api.types';

export type {
  CreateFeedbackRequest,
  CreateFeedbackResponse,
  GetFeedbacksRequest,
  GetFeedbacksResult,
} from '@/types/user/feedback.api.types';

const create = async (
  payload: CreateFeedbackRequest
): Promise<CreateFeedbackResponse> => {
  const response = await axiosInstance.post<
    ApiResponse<CreateFeedbackResponse>
  >('/feedback', payload);

  return response.data.metadata;
};

const getFeedbacks = async (
  params: GetFeedbacksRequest
): Promise<GetFeedbacksResult> => {
  const response = await axiosInstance.get<ApiResponse<GetFeedbacksResult>>(
    '/feedback',
    {
      params,
    }
  );

  return response.data.metadata;
};

export const userFeedbackApi = {
  create,
  getFeedbacks,
};
