import { ServiceRepository } from "../repository/service.repository";
import { ServiceCategoryRepository } from "../repository/serviceCategory.repository";
import ServiceService from "../services/service.service";
import ServiceController from "../controllers/service.controller";

const serviceRepo = new ServiceRepository();
const serviceCategoryRepo = new ServiceCategoryRepository();

const serviceService = new ServiceService(serviceRepo, serviceCategoryRepo);

export const serviceController = new ServiceController(serviceService);
