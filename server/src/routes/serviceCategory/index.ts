import express from "express";
import { serviceCategoryController } from "../../container/serviceCategory.container";
import { asyncHandler } from "../../helper/asyncHandler";
import { authentication, authorizeRoles } from "../../auth/authUtils";
import "../../docs/serviceCategory.doc";

const router = express.Router();

router.get(
  "/service-categories",
  asyncHandler(serviceCategoryController.getAllServiceCategories),
);
router.get(
  "/service-categories/:id",
  asyncHandler(serviceCategoryController.getServiceCategoryById),
);

router.post(
  "/service-categories",
  authentication,
  authorizeRoles("MANAGER", "ADMIN"),
  asyncHandler(serviceCategoryController.createServiceCategory),
);

router.put(
  "/service-categories/:id",
  authentication,
  authorizeRoles("MANAGER", "ADMIN"),
  asyncHandler(serviceCategoryController.updateServiceCategory),
);

router.delete(
  "/service-categories/:id",
  authentication,
  authorizeRoles("MANAGER", "ADMIN"),
  asyncHandler(serviceCategoryController.deleteServiceCategory),
);

router.post(
  "/room-service-categories",
  authentication,
  authorizeRoles("MANAGER", "ADMIN"),
  asyncHandler(serviceCategoryController.addRoomServiceCategory),
);

router.delete(
  "/room-service-categories/:roomId/:categoryId",
  authentication,
  authorizeRoles("MANAGER", "ADMIN"),
  asyncHandler(serviceCategoryController.removeRoomServiceCategory),
);

export default router;
