import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import { buildingController } from '../../container/building.container';
import '../../docs/building.doc';

const buildingRouter = express.Router();
buildingRouter.get(
  '/buildings',
  asyncHandler(buildingController.getAllBuildings),
);
buildingRouter.post(
  '/building',
  asyncHandler(buildingController.createBuilding),
);
buildingRouter.get(
  '/building/:id',
  asyncHandler(buildingController.getBuildingById),
);
buildingRouter.put(
  '/building/:id',
  asyncHandler(buildingController.updateBuilding),
);
buildingRouter.delete(
  '/building/:id',
  asyncHandler(buildingController.deleteBuilding),
);

export default buildingRouter;
