import type {
  CreateFeedbackPayload,
  FeedbackResponse,
  GetFeedbacksPayload,
  GetFeedbacksResponse,
} from '@/types/user/feedback-api';

export type CreateFeedbackRequest = CreateFeedbackPayload;
export type CreateFeedbackResponse = FeedbackResponse;
export type GetFeedbacksRequest = GetFeedbacksPayload;
export type GetFeedbacksResult = GetFeedbacksResponse;
