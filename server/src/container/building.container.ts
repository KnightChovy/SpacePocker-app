import BuildingController from '../controllers/building.controller';
import { prisma } from '../lib/prisma';
import { BuildingRepository } from '../repository/building.repository';
import { BuildingService } from '../services/building.service';
import { ManagerRepository } from '../repository/manager.repository';

const buildingRepository = new BuildingRepository(prisma);
const managerRepository = new ManagerRepository();
const buildingService = new BuildingService(
  buildingRepository,
  managerRepository,
);
const buildingController = new BuildingController(buildingService);

export { buildingController };
