import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'react-toastify';
import { authAPI, type UpdateUserProfilePayload } from '@/apis/auth.api';

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserProfilePayload) =>
      authAPI.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      toast.success('Profile updated successfully');
    },
    onError: error => {
      const message = isAxiosError(error)
        ? (error.response?.data?.message ?? 'Failed to update profile')
        : 'Failed to update profile';
      toast.error(message);
    },
  });
};
