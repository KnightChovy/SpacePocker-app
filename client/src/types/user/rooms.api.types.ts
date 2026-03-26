import type { RoomAmenitiesServicesResponse } from '@/types/user/booking-request-api';
import type {
  ApiRoom,
  GetAllRoomsResponse,
  RoomQueryParams,
  SearchAvailableRoomsParams,
  SearchAvailableRoomsResponse,
} from '@/types/user/room-api';

export type ListRoomsRequest = { params?: RoomQueryParams };
export type ListRoomsResponse = GetAllRoomsResponse;

export type SearchAvailableRoomsRequest = {
  params: SearchAvailableRoomsParams;
};
export type SearchAvailableRoomsApiResponse = SearchAvailableRoomsResponse;

export type GetRoomByIdRequest = { roomId: string };
export type GetRoomByIdResponse = { room: ApiRoom };

export type GetRoomAmenitiesServicesRequest = { roomId: string };
export type GetRoomAmenitiesServicesResponse = RoomAmenitiesServicesResponse;
