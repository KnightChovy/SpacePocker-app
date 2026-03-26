import axiosClient from '@/api/axiosClient';
import { ApiResponse } from '@/types/api.type';
import { User } from '@/types/user.type';

export type UpdateProfileRequest = {
  name?: string;
  phoneNumber?: string;
};

const userService = {
  updateProfile: async (
    data: UpdateProfileRequest
  ): Promise<ApiResponse<User>> => {
    const res = await axiosClient.patch<ApiResponse<User>>(
      '/users/profile',
      data
    );
    return res.data;
  },
};

export default userService;
