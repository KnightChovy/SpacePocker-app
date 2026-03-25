import BuildingController from '../controllers/building.controller';
import { prisma } from '../lib/prisma';
import { BuildingRepository } from '../repository/building.repository';
import { BuildingService } from '../services/building.service';

const buildingRepository = new BuildingRepository(prisma);
const buildingService = new BuildingService(buildingRepository);
const buildingController = new BuildingController(buildingService);

export { buildingController };
