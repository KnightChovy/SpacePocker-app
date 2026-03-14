import { AmenityRepository } from "../repository/amenity.repository";
import { RoomRepository } from "../repository/room.repository";
import AmenityService from "../services/amenity.service";
import AmenityController from "../controllers/amenity.controller";

const amenityRepo = new AmenityRepository();
const roomRepo = new RoomRepository();

const amenityService = new AmenityService(amenityRepo, roomRepo);

export const amenityController = new AmenityController(amenityService);
