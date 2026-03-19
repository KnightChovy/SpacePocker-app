import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminUsersApi } from '@/apis/admin/users.api';
import { toast } from 'react-toastify';

export const usePromoteUserToManager = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      return adminUsersApi.promoteToManager(userId);
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
