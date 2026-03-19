import axiosInstance from '@/lib/axios';
import type { ApiResponse } from '@/apis/api.types';
import type {
  ApiRoom,
  RoomQueryParams,
  UpdateRoomPayload,
} from '@/types/user/room-api';

import type {
  AttachRoomAmenitiesResponse,
  CreateRoomRequest,
  CreateRoomResponse,
  DeleteRoomResponse,
  GetRoomByIdResponse,
  ListRoomsResponse,
  SyncRoomAmenitiesRequest,
  SyncRoomAmenitiesResponse,
  UpdateRoomResponse,
} from '@/types/manager/rooms.api.types';

export type {
  AttachRoomAmenitiesRequest,
  AttachRoomAmenitiesResponse,
  CreateRoomRequest,
  CreateRoomResponse,
  DeleteRoomRequest,
  DeleteRoomResponse,
  GetRoomByIdRequest,
  GetRoomByIdResponse,
  ListRoomsRequest,
  ListRoomsResponse,
  SyncRoomAmenitiesRequest,
  SyncRoomAmenitiesResponse,
  UpdateRoomRequest,
  UpdateRoomResponse,
} from '@/types/manager/rooms.api.types';

const list = async (params?: RoomQueryParams): Promise<ListRoomsResponse> => {
  const response = await axiosInstance.get<ApiResponse<ListRoomsResponse>>(
    '/rooms',
    { params }
  );
  return response.data.metadata;
};

const getById = async (roomId: string): Promise<ApiRoom> => {
  const response = await axiosInstance.get<ApiResponse<GetRoomByIdResponse>>(
    `/rooms/${roomId}`
  );
  return response.data.metadata.room;
};

const create = async (payload: CreateRoomRequest): Promise<ApiRoom> => {
  const response = await axiosInstance.post<ApiResponse<CreateRoomResponse>>(
    '/rooms',
    payload
  );
  return response.data.metadata.room;
};

const update = async (roomId: string, payload: UpdateRoomPayload): Promise<ApiRoom> => {
  const response = await axiosInstance.patch<ApiResponse<UpdateRoomResponse>>(
    `/rooms/${roomId}`,
    payload
  );
  return response.data.metadata.room;
};

const remove = async (roomId: string): Promise<string> => {
  await axiosInstance.delete<DeleteRoomResponse>(`/rooms/${roomId}`);
  return roomId;
};

type AttachSingleRoomAmenityRequest = { roomId: string; amenityId: string };
type AttachSingleRoomAmenityResponse = void;

const attachAmenities = async (
  roomId: string,
  amenityIds: string[]
): Promise<AttachRoomAmenitiesResponse> => {
  const ids = amenityIds ?? [];
  if (ids.length === 0) return;

  await Promise.all(
    ids.map(amenityId =>
      axiosInstance.post<AttachSingleRoomAmenityResponse>(
        '/room-amenities',
        { roomId, amenityId } satisfies AttachSingleRoomAmenityRequest
      )
    )
  );
};

type DeleteSingleRoomAmenityResponse = void;

const syncAmenities = async (
  params: SyncRoomAmenitiesRequest
): Promise<SyncRoomAmenitiesResponse> => {
  const current = new Set(params.currentAmenityIds ?? []);
  const next = new Set(params.nextAmenityIds ?? []);

  const toAttach = [...next].filter(id => !current.has(id));
  const toDetach = [...current].filter(id => !next.has(id));

  await Promise.all([
    ...toAttach.map(amenityId =>
      axiosInstance.post<AttachSingleRoomAmenityResponse>(
        '/room-amenities',
        {
          roomId: params.roomId,
          amenityId,
        } satisfies AttachSingleRoomAmenityRequest
      )
    ),
    ...toDetach.map(amenityId =>
      axiosInstance.delete<DeleteSingleRoomAmenityResponse>(
        `/room-amenities/${params.roomId}/${amenityId}`
      )
    ),
  ]);
};

export const managerRoomsApi = {
  list,
  getById,
  create,
  update,
  remove,
  attachAmenities,
  syncAmenities,
};
