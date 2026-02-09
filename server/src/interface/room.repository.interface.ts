// export interface IRoomRepository {
//   findById(id: string): Promise<any | null>;
//   createRoom(data: {
//     buildingId: string,
//     name: string,
//     description?: string,
//     pricePerHour: number,
//     securityDeposit: number,
//     capacity: number,
//     roomType:
//   })
// }
import { Room } from '@prisma/client';

export interface IRoomRepository {
  findById(roomId: string): Promise<Room | null>;
}
