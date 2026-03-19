import type {
  ApiRoom,
  CreateRoomPayload,
  GetAllRoomsResponse,
  RoomQueryParams,
  UpdateRoomPayload,
} from '@/types/user/room-api';

export type ListRoomsRequest = { params?: RoomQueryParams };
export type ListRoomsResponse = GetAllRoomsResponse;

export type GetRoomByIdRequest = { roomId: string };
export type GetRoomByIdResponse = { room: ApiRoom };

export type CreateRoomRequest = CreateRoomPayload;
export type CreateRoomResponse = { room: ApiRoom };

export type UpdateRoomRequest = { roomId: string; payload: UpdateRoomPayload };
export type UpdateRoomResponse = { room: ApiRoom };

export type DeleteRoomRequest = { roomId: string };
export type DeleteRoomResponse = void;

export type AttachRoomAmenitiesRequest = {
  roomId: string;
  amenityIds: string[];
};
export type AttachRoomAmenitiesResponse = void;

export type SyncRoomAmenitiesRequest = {
  roomId: string;
  currentAmenityIds: string[];
  nextAmenityIds: string[];
};
export type SyncRoomAmenitiesResponse = void;
