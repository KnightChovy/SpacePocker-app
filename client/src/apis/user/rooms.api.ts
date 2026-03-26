import axiosInstance from '@/lib/axios';
import type { ApiResponse } from '@/apis/api.types';
import type {
  ApiRoom,
  RoomQueryParams,
  SearchAvailableRoomsParams,
  SearchAvailableRoomsResponse,
} from '@/types/user/room-api';

import type {
  GetRoomAmenitiesServicesResponse,
  GetRoomByIdResponse,
  ListRoomsResponse,
  SearchAvailableRoomsApiResponse,
} from '@/types/user/rooms.api.types';

export type {
  GetRoomAmenitiesServicesRequest,
  GetRoomAmenitiesServicesResponse,
  GetRoomByIdRequest,
  GetRoomByIdResponse,
  ListRoomsRequest,
  ListRoomsResponse,
  SearchAvailableRoomsRequest,
  SearchAvailableRoomsApiResponse,
} from '@/types/user/rooms.api.types';

const list = async (params?: RoomQueryParams): Promise<ListRoomsResponse> => {
  const response = await axiosInstance.get<ApiResponse<ListRoomsResponse>>(
    '/rooms',
    { params }
  );
  return response.data.metadata;
};

const searchAvailable = async (
  params: SearchAvailableRoomsParams
): Promise<SearchAvailableRoomsResponse> => {
  const response = await axiosInstance.get<
    ApiResponse<SearchAvailableRoomsApiResponse>
  >('/rooms/search', { params });
  return response.data.metadata;
};

const getById = async (roomId: string): Promise<ApiRoom> => {
  const response = await axiosInstance.get<ApiResponse<GetRoomByIdResponse>>(
    `/rooms/${roomId}`
  );
  return response.data.metadata.room;
};

const getAmenitiesServices = async (
  roomId: string
): Promise<GetRoomAmenitiesServicesResponse> => {
  const response = await axiosInstance.get<
    ApiResponse<GetRoomAmenitiesServicesResponse>
  >(`/rooms/${roomId}/amenities-services`);
  return response.data.metadata;
};

export const userRoomsApi = {
  list,
  searchAvailable,
  getById,
  getAmenitiesServices,
};
