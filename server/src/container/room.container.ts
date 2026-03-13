import { RoomRepository } from '../repository/room.repository';
import RoomService from '../services/room.service';
import RoomController from '../controllers/room.controller';
import { BuildingRepository } from '../repository/building.repository';
import { prisma } from '../lib/prisma';

const roomRepo = new RoomRepository();
const buildingRepo = new BuildingRepository(prisma);

const roomService = new RoomService(roomRepo, buildingRepo);

export const roomController = new RoomController(roomService);
