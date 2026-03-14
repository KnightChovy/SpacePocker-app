import { Request, Response, NextFunction } from "express";
import ServiceService from "../services/service.service";
import { Created, OK } from "../core/success.response";

class ServiceController {
  constructor(private serviceService: ServiceService) {}

  createService = async (req: Request, res: Response, next: NextFunction) => {
    new Created({
      message: "Service created successfully",
      metadata: await this.serviceService.createService(req.body),
    }).send(res);
  };

  getAllServices = async (req: Request, res: Response, next: NextFunction) => {
    new OK({
      message: "Get all services successfully",
      metadata: await this.serviceService.getAllServices(),
    }).send(res);
  };

  getServiceById = async (req: Request, res: Response, next: NextFunction) => {
    new OK({
      message: "Get service successfully",
      metadata: await this.serviceService.getServiceById(String(req.params.id)),
    }).send(res);
  };

  getServicesByCategoryId = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    new OK({
      message: "Get services by category successfully",
      metadata: await this.serviceService.getServicesByCategoryId(
        String(req.params.categoryId),
      ),
    }).send(res);
  };

  updateService = async (req: Request, res: Response, next: NextFunction) => {
    new OK({
      message: "Service updated successfully",
      metadata: await this.serviceService.updateService(
        String(req.params.id),
        req.body,
      ),
    }).send(res);
  };

  deleteService = async (req: Request, res: Response, next: NextFunction) => {
    new OK({
      message: "Service deleted successfully",
      metadata: await this.serviceService.deleteService(String(req.params.id)),
    }).send(res);
  };
}

export default ServiceController;
