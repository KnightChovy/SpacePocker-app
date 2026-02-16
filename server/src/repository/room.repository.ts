import { IRoomRepository } from '../interface/room.repository.interface';
import { prisma } from '../lib/prisma';

export class RoomRepository implements IRoomRepository {
  async findById(roomId: string) {
    return prisma.room.findUnique({
      where: { id: roomId },
    });
  }
}
