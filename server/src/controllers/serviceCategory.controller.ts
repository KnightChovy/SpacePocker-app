import { Request, Response, NextFunction } from "express";
import ServiceCategoryService from "../services/serviceCategory.service";
import { Created, OK } from "../core/success.response";

class ServiceCategoryController {
  constructor(private serviceCategoryService: ServiceCategoryService) {}

  createServiceCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    new Created({
      message: "Service category created successfully",
      metadata: await this.serviceCategoryService.createServiceCategory(
        req.body,
      ),
    }).send(res);
  };

  getAllServiceCategories = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    new OK({
      message: "Get all service categories successfully",
      metadata: await this.serviceCategoryService.getAllServiceCategories(),
    }).send(res);
  };

  getServiceCategoryById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    new OK({
      message: "Get service category successfully",
      metadata: await this.serviceCategoryService.getServiceCategoryById(
        String(req.params.id),
      ),
    }).send(res);
  };

  updateServiceCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    new OK({
      message: "Service category updated successfully",
      metadata: await this.serviceCategoryService.updateServiceCategory(
        String(req.params.id),
        req.body,
      ),
    }).send(res);
  };

  deleteServiceCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    new OK({
      message: "Service category deleted successfully",
      metadata: await this.serviceCategoryService.deleteServiceCategory(
        String(req.params.id),
      ),
    }).send(res);
  };

  addRoomServiceCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    new Created({
      message: "Service category added to room successfully",
      metadata: await this.serviceCategoryService.addRoomServiceCategory(
        req.body,
      ),
    }).send(res);
  };

  removeRoomServiceCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    new OK({
      message: "Service category removed from room successfully",
      metadata: await this.serviceCategoryService.removeRoomServiceCategory(
        String(req.params.roomId),
        String(req.params.categoryId),
      ),
    }).send(res);
  };
}

export default ServiceCategoryController;
