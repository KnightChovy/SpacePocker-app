import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'react-toastify';

import { userFeedbackApi } from '@/apis/user/feedback.api';
import type {
  CreateFeedbackPayload,
} from '@/types/user/feedback-api';

export const useCreateFeedback = () => {
  return useMutation({
    mutationFn: async (payload: CreateFeedbackPayload) => {
      return userFeedbackApi.create(payload);
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
