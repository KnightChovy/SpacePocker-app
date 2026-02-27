import type { ManagerRoom, RoomStatus } from '@/types/types';
import { MANAGER_ROOMS } from '@/data/constantManager';

let roomsStore = [...MANAGER_ROOMS];

export interface RoomsResponse {
  data: ManagerRoom[];
  total: number;
}

export interface RoomResponse {
  data: ManagerRoom;
}

export interface RoomFilterParams {
  search?: string;
  building?: string;
  status?: RoomStatus;
  type?: string;
  minCapacity?: number;
  maxCapacity?: number;
  page?: number;
  limit?: number;
}

export interface CreateRoomData {
  name: string;
  building: string;
  type: string;
  capacity: number;
  pricePerHour: number;
  status: RoomStatus;
  amenities: string[];
  imageUrl?: string;
  description?: string;
}

export interface UpdateRoomData extends Partial<CreateRoomData> {
  id: string;
}

export const roomService = {
  getAllRooms: async (params?: RoomFilterParams): Promise<ManagerRoom[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    let filteredRooms = [...roomsStore];

    if (params) {
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        filteredRooms = filteredRooms.filter(
          room =>
            room.name.toLowerCase().includes(searchLower) ||
            room.building.toLowerCase().includes(searchLower) ||
            room.type.toLowerCase().includes(searchLower)
        );
      }

      if (params.building && params.building !== 'all') {
        filteredRooms = filteredRooms.filter(
          room => room.building === params.building
        );
      }

      if (params.status && params.status !== ('all' as RoomStatus)) {
        filteredRooms = filteredRooms.filter(
          room => room.status === params.status
        );
      }

      if (params.type) {
        filteredRooms = filteredRooms.filter(room => room.type === params.type);
      }

      if (params.minCapacity !== undefined) {
        filteredRooms = filteredRooms.filter(
          room => room.capacity >= params.minCapacity!
        );
      }
      if (params.maxCapacity !== undefined) {
        filteredRooms = filteredRooms.filter(
          room => room.capacity <= params.maxCapacity!
        );
      }
    }

    return filteredRooms;
  },

  getRoomById: async (id: string): Promise<ManagerRoom | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return roomsStore.find(room => room.id === id);
  },

  createRoom: async (data: CreateRoomData): Promise<ManagerRoom> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const newRoom: ManagerRoom = {
      ...data,
      id: Date.now().toString(),
      imageUrl:
        data.imageUrl ||
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300',
    };

    roomsStore.push(newRoom);
    console.log('Created room:', newRoom);
    return newRoom;
  },

  updateRoom: async (data: UpdateRoomData): Promise<ManagerRoom> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const index = roomsStore.findIndex(room => room.id === data.id);
    if (index === -1) {
      throw new Error(`Room with id ${data.id} not found`);
    }

    const updatedRoom: ManagerRoom = {
      ...roomsStore[index],
      ...data,
    };

    roomsStore[index] = updatedRoom;
    console.log('Updated room:', updatedRoom);
    return updatedRoom;
  },

  deleteRoom: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const index = roomsStore.findIndex(room => room.id === id);
    if (index === -1) {
      throw new Error(`Room with id ${id} not found`);
    }

    roomsStore.splice(index, 1);
    console.log('Deleted room:', id);
  },

  getBuildings: async (): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));

    const buildings = [...new Set(roomsStore.map(room => room.building))];
    return buildings;
  },

  getRoomTypes: async (): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));

    const types = [...new Set(roomsStore.map(room => room.type))];
    return types;
  },

  bulkUpdateStatus: async (
    ids: string[],
    status: RoomStatus
  ): Promise<ManagerRoom[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const updatedRooms: ManagerRoom[] = [];
    ids.forEach(id => {
      const index = roomsStore.findIndex(room => room.id === id);
      if (index !== -1) {
        roomsStore[index] = { ...roomsStore[index], status };
        updatedRooms.push(roomsStore[index]);
      }
    });

    console.log('Bulk updated rooms status:', updatedRooms);
    return updatedRooms;
  },

  resetMockData: (): void => {
    roomsStore = [...MANAGER_ROOMS];
    console.log('Mock data reset');
  },
};

export default roomService;
