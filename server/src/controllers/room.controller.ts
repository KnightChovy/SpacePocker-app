import { OK, Created } from "../core/success.response";
import { Request, Response, NextFunction } from "express";
import RoomService from "../services/room.service";

class RoomController {
  constructor(private roomService: RoomService) {}

  createRoom = async (req: Request, res: Response, next: NextFunction) => {
    new Created({
      message: "Room created successfully",
      metadata: await this.roomService.createRoom(req.body),
    }).send(res);
  };

  getRoomById = async (req: Request, res: Response, next: NextFunction) => {
    new OK({
      message: "Get room successfully",
      metadata: await this.roomService.getRoomById(String(req.params.id)),
    }).send(res);
  };

  searchAvailableRooms = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    new OK({
      message: "Search available rooms successfully",
      metadata: await this.roomService.searchAvailableRooms(req.query),
    }).send(res);
  };

  getAllRooms = async (req: Request, res: Response, next: NextFunction) => {
    new OK({
      message: "Get all rooms successfully",
      metadata: await this.roomService.getAllRooms(req.query),
    }).send(res);
  };

  updateRoom = async (req: Request, res: Response, next: NextFunction) => {
    new OK({
      message: "Room updated successfully",
      metadata: await this.roomService.updateRoom(
        String(req.params.id),
        req.body,
      ),
    }).send(res);
  };

  getRoomAmenitiesAndServices = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    new OK({
      message: "Get room amenities and services successfully",
      metadata: await this.roomService.getRoomAmenitiesAndServices(
        String(req.params.id),
      ),
    }).send(res);
  };

  deleteRoom = async (req: Request, res: Response, next: NextFunction) => {
    new OK({
      message: "Room deleted successfully",
      metadata: await this.roomService.deleteRoom(String(req.params.id)),
    }).send(res);
  };
}

export default RoomController;
