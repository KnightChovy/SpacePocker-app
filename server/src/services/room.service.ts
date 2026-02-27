import { IRoomRepository } from '../interface/room.repository.interface';
import { IBuildingRepository } from '../interface/building.repository.interface';
import {
  BadRequestError,
  NotFoundError,
  ConflictRequestError,
} from '../core/error.response';
import { RoomType } from '@prisma/client';

export default class RoomService {
  constructor(
    private roomRepo: IRoomRepository,
    private buildingRepo: IBuildingRepository,
  ) {}

  async createRoom(data: {
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
  }) {
    const {
      buildingId,
      managerId,
      name,
      description,
      pricePerHour,
      securityDeposit,
      capacity,
      roomType,
      area,
      roomCode,
    } = data;

    if (!buildingId) {
      throw new BadRequestError('Building ID is required');
    }
    if (!managerId) {
      throw new BadRequestError('Manager ID is required');
    }
    if (!name || name.trim() === '') {
      throw new BadRequestError('Room name is required');
    }
    if (!pricePerHour || pricePerHour <= 0) {
      throw new BadRequestError('Price per hour must be greater than 0');
    }
    if (!capacity || capacity <= 0) {
      throw new BadRequestError('Capacity must be greater than 0');
    }
    if (!roomType) {
      throw new BadRequestError('Room type is required');
    }
    if (!roomCode || roomCode.trim() === '') {
      throw new BadRequestError('Room code is required');
    }

    const building = await this.buildingRepo.findById(buildingId);
    if (!building) {
      throw new NotFoundError('Building not found');
    }

    const existingRoom = await this.roomRepo.findByRoomCode(roomCode);
    if (existingRoom) {
      throw new ConflictRequestError(`Room code '${roomCode}' already exists`);
    }

    const room = await this.roomRepo.create({
      buildingId,
      managerId,
      name,
      description,
      pricePerHour,
      securityDeposit,
      capacity,
      roomType,
      area,
      roomCode,
    });

    return { room };
  }

  async getRoomById(roomId: string) {
    if (!roomId) {
      throw new BadRequestError('Room ID is required');
    }

    const room = await this.roomRepo.findById(roomId);
    if (!room) {
      throw new NotFoundError('Room not found');
    }

    return { room };
  }

  async getAllRooms(query: any) {
    const {
      search,
      buildingId,
      roomType,
      isAvailable,
      minPrice,
      maxPrice,
      minCapacity,
      sortBy,
      sortOrder,
      limit,
      offset,
    } = query;

    const filter: any = {};

    if (search && typeof search === 'string') {
      filter.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          roomCode: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (buildingId && typeof buildingId === 'string') {
      filter.buildingId = buildingId;
    }

    if (roomType && typeof roomType === 'string') {
      const validRoomTypes = ['MEETING', 'CLASSROOM', 'EVENT', 'OTHER'];
      if (validRoomTypes.includes(roomType.toUpperCase())) {
        filter.roomType = roomType.toUpperCase();
      }
    }

    if (isAvailable !== undefined) {
      filter.isAvailable = isAvailable === 'true' || isAvailable === true;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.pricePerHour = {};
      if (minPrice !== undefined) {
        const parsedMinPrice = parseFloat(String(minPrice));
        if (!isNaN(parsedMinPrice)) {
          filter.pricePerHour.gte = parsedMinPrice;
        }
      }
      if (maxPrice !== undefined) {
        const parsedMaxPrice = parseFloat(String(maxPrice));
        if (!isNaN(parsedMaxPrice)) {
          filter.pricePerHour.lte = parsedMaxPrice;
        }
      }
    }

    if (minCapacity !== undefined) {
      const parsedMinCapacity = parseInt(String(minCapacity), 10);
      if (!isNaN(parsedMinCapacity)) {
        filter.capacity = { gte: parsedMinCapacity };
      }
    }

    let orderBy: any = undefined;
    if (sortBy) {
      const validSortFields = [
        'name',
        'pricePerHour',
        'capacity',
        'roomType',
        'createdAt',
      ];
      const validSortOrders = ['asc', 'desc'];

      if (validSortFields.includes(sortBy)) {
        const order = validSortOrders.includes(sortOrder?.toLowerCase())
          ? sortOrder.toLowerCase()
          : 'asc';

        orderBy = { [sortBy]: order };
      }
    }

    const parsedLimit = limit ? parseInt(String(limit), 10) : 10;
    const parsedOffset = offset ? parseInt(String(offset), 10) : 0;

    const safeLimit =
      !isNaN(parsedLimit) && parsedLimit > 0 && parsedLimit <= 100
        ? parsedLimit
        : 10;
    const safeOffset =
      !isNaN(parsedOffset) && parsedOffset >= 0 ? parsedOffset : 0;

    const total = await this.roomRepo.count(
      Object.keys(filter).length > 0 ? filter : undefined,
    );

    const rooms = await this.roomRepo.findAll(
      Object.keys(filter).length > 0 ? filter : undefined,
      orderBy,
      safeLimit,
      safeOffset,
    );

    return {
      rooms,
      pagination: {
        total,
        limit: safeLimit,
        offset: safeOffset,
        hasMore: safeOffset + safeLimit < total,
      },
      filters: {
        search: search || null,
        buildingId: buildingId || null,
        roomType: roomType || null,
        isAvailable: isAvailable !== undefined ? filter.isAvailable : null,
        minPrice: minPrice || null,
        maxPrice: maxPrice || null,
        minCapacity: minCapacity || null,
        sortBy: sortBy || null,
        sortOrder: sortOrder || null,
      },
    };
  }

  async updateRoom(
    roomId: string,
    data: {
      name?: string;
      description?: string;
      pricePerHour?: number;
      securityDeposit?: number;
      capacity?: number;
      roomType?: RoomType;
      area?: number;
      isAvailable?: boolean;
    },
  ) {
    if (!roomId) {
      throw new BadRequestError('Room ID is required');
    }

    const existingRoom = await this.roomRepo.findById(roomId);
    if (!existingRoom) {
      throw new NotFoundError('Room not found');
    }

    if (data.name !== undefined && data.name.trim() === '') {
      throw new BadRequestError('Room name cannot be empty');
    }
    if (data.pricePerHour !== undefined && data.pricePerHour <= 0) {
      throw new BadRequestError('Price per hour must be greater than 0');
    }
    if (data.capacity !== undefined && data.capacity <= 0) {
      throw new BadRequestError('Capacity must be greater than 0');
    }

    const room = await this.roomRepo.update(roomId, data);

    return { room };
  }

  async deleteRoom(roomId: string) {
    if (!roomId) {
      throw new BadRequestError('Room ID is required');
    }

    const existingRoom = await this.roomRepo.findById(roomId);
    if (!existingRoom) {
      throw new NotFoundError('Room not found');
    }

    const room = await this.roomRepo.delete(roomId);

    return { room };
  }
}
