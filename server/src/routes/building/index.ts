import express from "express";
import { asyncHandler } from "../../helper/asyncHandler";
import { buildingController } from "../../container/building.container";
import { authentication } from "../../auth/authUtils";
import "../../docs/building.doc";

const buildingRouter = express.Router();

buildingRouter.get(
  "/buildings",
  asyncHandler(buildingController.getAllBuildings),
);
buildingRouter.get(
  "/buildings/:id",
  asyncHandler(buildingController.getBuildingById),
);
buildingRouter.post(
  "/buildings",
  authentication,
  asyncHandler(buildingController.createBuilding),
);
buildingRouter.patch(
  "/buildings/:id",
  authentication,
  asyncHandler(buildingController.updateBuilding),
);
buildingRouter.delete(
  "/buildings/:id",
  authentication,
  asyncHandler(buildingController.deleteBuilding),
);

export default buildingRouter;
