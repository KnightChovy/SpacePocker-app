import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { toast } from 'react-toastify';

export const usePromoteUserToManager = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      await axiosInstance.patch(`/admin/users/promote-manager/${userId}`);
      return userId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'list'] });
      toast.success('User promoted to manager successfully!');
    },
    onError: error => {
      console.error('Promote user to manager error:', error);
      toast.error('Failed to promote user. Please try again.');
    },
  });
};
