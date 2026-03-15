import express from "express";
import { serviceController } from "../../container/service.container";
import { asyncHandler } from "../../helper/asyncHandler";
import { authentication, authorizeRoles } from "../../auth/authUtils";
import "../../docs/service.doc";

const router = express.Router();

router.get("/services", asyncHandler(serviceController.getAllServices));
router.get("/services/:id", asyncHandler(serviceController.getServiceById));
router.get(
  "/services/category/:categoryId",
  asyncHandler(serviceController.getServicesByCategoryId),
);

router.post(
  "/services",
  authentication,
  authorizeRoles("MANAGER", "ADMIN"),
  asyncHandler(serviceController.createService),
);

router.put(
  "/services/:id",
  authentication,
  authorizeRoles("MANAGER", "ADMIN"),
  asyncHandler(serviceController.updateService),
);

router.delete(
  "/services/:id",
  authentication,
  authorizeRoles("MANAGER", "ADMIN"),
  asyncHandler(serviceController.deleteService),
);

export default router;
