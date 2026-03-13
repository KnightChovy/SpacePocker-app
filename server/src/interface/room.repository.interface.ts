import { Room, RoomType, RoomStatus } from '@prisma/client';

export interface IRoomRepository {
  findById(roomId: string): Promise<Room | null>;
  create(data: {
    buildingId: string;
    managerId: string;
    name: string;
    description?: string;
    pricePerHour: number;
    securityDeposit?: number;
    capacity: number;
    roomType: RoomType;
    area?: number;
    roomCode: string;
  }): Promise<Room>;
  findAll(
    filter?: any,
    orderBy?: any,
    limit?: number,
    offset?: number,
  ): Promise<Room[]>;
  update(
    roomId: string,
    data: {
      name?: string;
      description?: string;
      pricePerHour?: number;
      securityDeposit?: number;
      capacity?: number;
      roomType?: RoomType;
      area?: number;
      status?: RoomStatus;
    },
  ): Promise<Room>;
  delete(roomId: string): Promise<Room>;
  count(filter?: any): Promise<number>;
  findByRoomCode(roomCode: string): Promise<Room | null>;
}
