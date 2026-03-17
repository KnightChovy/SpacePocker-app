import axiosClient from '@/api/axiosClient';
import { GetAllRoomsParams, GetAllRoomsResponse } from '@/types/room.type';

const roomService = {
  getAllRooms: async (
    params?: GetAllRoomsParams
  ): Promise<GetAllRoomsResponse> => {
    const res = await axiosClient.get<GetAllRoomsResponse>('/rooms', {
      params,
    });
    return res.data;
  },
};

export default roomService;
