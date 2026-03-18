import axiosClient from '@/api/axiosClient';
import {
  GetAllRoomsParams,
  GetAllRoomsResponse,
  GetRoomByIdResponse,
} from '@/types/room.type';

const roomService = {
  getAllRooms: async (
    params?: GetAllRoomsParams
  ): Promise<GetAllRoomsResponse> => {
    const res = await axiosClient.get<GetAllRoomsResponse>('/rooms', {
      params,
    });
    return res.data;
  },
  getRoomById: async (id: string): Promise<GetRoomByIdResponse> => {
    const res = await axiosClient.get<GetRoomByIdResponse>(`/rooms/${id}`);
    return res.data;
  },
};

export default roomService;
