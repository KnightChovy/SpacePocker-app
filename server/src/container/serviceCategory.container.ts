import { ServiceCategoryRepository } from "../repository/serviceCategory.repository";
import { RoomRepository } from "../repository/room.repository";
import ServiceCategoryService from "../services/serviceCategory.service";
import ServiceCategoryController from "../controllers/serviceCategory.controller";

const serviceCategoryRepo = new ServiceCategoryRepository();
const roomRepo = new RoomRepository();

const serviceCategoryService = new ServiceCategoryService(
  serviceCategoryRepo,
  roomRepo,
);

export const serviceCategoryController = new ServiceCategoryController(
  serviceCategoryService,
);
