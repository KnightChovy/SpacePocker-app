import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import { buildingController } from '../../container/building.container';
import { authentication, authorizeRoles } from '../../auth/authUtils';
import '../../docs/building.doc';

const buildingRouter = express.Router();

buildingRouter.get(
  '/buildings',
  asyncHandler(buildingController.getAllBuildings),
);
buildingRouter.get(
  '/buildings/:id',
  asyncHandler(buildingController.getBuildingById),
);
buildingRouter.post(
  '/buildings',
  authentication,
  authorizeRoles('MANAGER', 'ADMIN'),
  asyncHandler(buildingController.createBuilding),
);
buildingRouter.patch(
  '/buildings/:id',
  authentication,
  authorizeRoles('MANAGER', 'ADMIN'),
  asyncHandler(buildingController.updateBuilding),
);
buildingRouter.delete(
  '/buildings/:id',
  authentication,
  authorizeRoles('MANAGER', 'ADMIN'),
  asyncHandler(buildingController.deleteBuilding),
);

export default buildingRouter;
