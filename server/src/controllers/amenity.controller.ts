import { Request, Response, NextFunction } from "express";
import AmenityService from "../services/amenity.service";
import { Created, OK } from "../core/success.response";

class AmenityController {
  constructor(private amenityService: AmenityService) {}

  createAmenity = async (req: Request, res: Response, next: NextFunction) => {
    new Created({
      message: "Amenity created successfully",
      metadata: await this.amenityService.createAmenity(req.body),
    }).send(res);
  };

  getAllAmenities = async (req: Request, res: Response, next: NextFunction) => {
    new OK({
      message: "Get all amenities successfully",
      metadata: await this.amenityService.getAllAmenities(),
    }).send(res);
  };

  getAmenityById = async (req: Request, res: Response, next: NextFunction) => {
    new OK({
      message: "Get amenity successfully",
      metadata: await this.amenityService.getAmenityById(String(req.params.id)),
    }).send(res);
  };

  updateAmenity = async (req: Request, res: Response, next: NextFunction) => {
    new OK({
      message: "Amenity updated successfully",
      metadata: await this.amenityService.updateAmenity(
        String(req.params.id),
        req.body,
      ),
    }).send(res);
  };

  deleteAmenity = async (req: Request, res: Response, next: NextFunction) => {
    new OK({
      message: "Amenity deleted successfully",
      metadata: await this.amenityService.deleteAmenity(String(req.params.id)),
    }).send(res);
  };

  addRoomAmenity = async (req: Request, res: Response, next: NextFunction) => {
    new Created({
      message: "Room amenity added successfully",
      metadata: await this.amenityService.addRoomAmenity(req.body),
    }).send(res);
  };

  removeRoomAmenity = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    new OK({
      message: "Room amenity removed successfully",
      metadata: await this.amenityService.removeRoomAmenity(
        String(req.params.roomId),
        String(req.params.amenityId),
      ),
    }).send(res);
  };
}

export default AmenityController;
