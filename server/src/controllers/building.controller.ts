import { NextFunction, Request, Response } from 'express';
import { BuildingService } from '../services/building.service';
import { Created, OK } from '../core/success.response';

class BuildingController {
  constructor(private buildingService: BuildingService) {}

  createBuilding = async (req: Request, res: Response, next: NextFunction) => {
    new Created({
      message: 'Building created successfully!',
      metadata: await this.buildingService.createBuilding(req.body),
    }).send(res);
  };

  getBuildingById = async (req: Request, res: Response, next: NextFunction) => {
    new OK({
      message: 'Building retrieved successfully!',
      metadata: await this.buildingService.getBuildingById(
        req.params.id as string,
      ),
    }).send(res);
  };

  getAllBuildings = async (req: Request, res: Response, next: NextFunction) => {
    new OK({
      message: 'Buildings retrieved successfully!',
      metadata: await this.buildingService.getAllBuildings(req.query),
    }).send(res);
  };

  updateBuilding = async (req: Request, res: Response, next: NextFunction) => {
    new OK({
      message: 'Building updated successfully',
      metadata: await this.buildingService.updateBuilding(
        req.params.id as string,
        req.body,
      ),
    }).send(res);
  };

  deleteBuilding = async (req: Request, res: Response, next: NextFunction) => {
    new OK({
      message: 'Building deleted successfully',
      metadata: await this.buildingService.deleteBuilding(
        req.params.id as string,
      ),
    }).send(res);
  };
}

export default BuildingController;
