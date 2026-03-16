import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'react-toastify';

import axiosInstance from '@/lib/axios';
import type {
  CreateFeedbackPayload,
  FeedbackResponse,
} from '@/types/feedback-api';

export const useCreateFeedback = () => {
  return useMutation({
    mutationFn: async (payload: CreateFeedbackPayload) => {
      const response = await axiosInstance.post<{ metadata: FeedbackResponse }>(
        '/feedback',
        payload
      );

      return response.data.metadata;
    },
    onSuccess: () => {
      toast.success('Feedback submitted!');
    },
    onError: error => {
      const message = isAxiosError(error)
        ? (error.response?.data?.message ?? 'Failed to submit feedback.')
        : 'Failed to submit feedback.';
      toast.error(message);
    },
  });
};
