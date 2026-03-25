import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import { roomController } from '../../container/room.container';
import { authentication, authorizeRoles } from '../../auth/authUtils';

const roomRouter = express.Router();

roomRouter.get('/rooms', asyncHandler(roomController.getAllRooms));
roomRouter.get('/rooms/:id', asyncHandler(roomController.getRoomById));
roomRouter.get(
  '/rooms/:id/amenities-services',
  asyncHandler(roomController.getRoomAmenitiesAndServices),
);

roomRouter.post(
  '/rooms',
  authentication,
  authorizeRoles('MANAGER', 'ADMIN'),
  asyncHandler(roomController.createRoom),
);
roomRouter.patch(
  '/rooms/:id',
  authentication,
  authorizeRoles('MANAGER', 'ADMIN'),
  asyncHandler(roomController.updateRoom),
);
roomRouter.delete(
  '/rooms/:id',
  authentication,
  authorizeRoles('MANAGER', 'ADMIN'),
  asyncHandler(roomController.deleteRoom),
);

export default roomRouter;
