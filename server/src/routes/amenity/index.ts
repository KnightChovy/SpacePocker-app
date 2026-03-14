import express from "express";
import { amenityController } from "../../container/amenity.container";
import { asyncHandler } from "../../helper/asyncHandler";
import { authentication, authorizeRoles } from "../../auth/authUtils";
import "../../docs/amenity.doc";

const router = express.Router();

// Public routes - anyone can view amenities
router.get("/amenities", asyncHandler(amenityController.getAllAmenities));
router.get("/amenities/:id", asyncHandler(amenityController.getAmenityById));

router.post(
  "/amenities",
  authentication,
  authorizeRoles("MANAGER", "ADMIN"),
  asyncHandler(amenityController.createAmenity),
);
router.put(
  "/amenities/:id",
  authentication,
  authorizeRoles("MANAGER", "ADMIN"),
  asyncHandler(amenityController.updateAmenity),
);
router.delete(
  "/amenities/:id",
  authentication,
  authorizeRoles("MANAGER", "ADMIN"),
  asyncHandler(amenityController.deleteAmenity),
);

// Room Amenity Management
router.post(
  "/room-amenities",
  authentication,
  authorizeRoles("MANAGER", "ADMIN"),
  asyncHandler(amenityController.addRoomAmenity),
);
router.delete(
  "/room-amenities/:roomId/:amenityId",
  authentication,
  authorizeRoles("MANAGER", "ADMIN"),
  asyncHandler(amenityController.removeRoomAmenity),
);

export default router;
