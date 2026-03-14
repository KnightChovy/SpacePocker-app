import express from "express";
import { asyncHandler } from "../../helper/asyncHandler";
import { roomController } from "../../container/room.container";
import { authentication } from "../../auth/authUtils";

const roomRouter = express.Router();

roomRouter.get("/rooms", asyncHandler(roomController.getAllRooms));
roomRouter.get("/rooms/:id", asyncHandler(roomController.getRoomById));

roomRouter.post(
  "/rooms",
  authentication,
  asyncHandler(roomController.createRoom),
);
roomRouter.patch(
  "/rooms/:id",
  authentication,
  asyncHandler(roomController.updateRoom),
);
roomRouter.delete(
  "/rooms/:id",
  authentication,
  asyncHandler(roomController.deleteRoom),
);

export default roomRouter;
