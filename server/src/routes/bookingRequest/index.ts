import express from "express";
import { bookingRequestController } from "../../container/bookingRequest.container";
import { asyncHandler } from "../../helper/asyncHandler";
import { authentication, authorizeRoles } from "../../auth/authUtils";

const router = express.Router();

router.use(authentication);

router.post(
  "/booking-requests",
  asyncHandler(bookingRequestController.createBookingRequest),
);
router.get(
  "/booking-requests",
  authorizeRoles("MANAGER", "ADMIN"),
  asyncHandler(bookingRequestController.getBookingRequestsForManager),
);
router.patch(
  "/booking-requests/approve/:id",
  authorizeRoles("MANAGER", "ADMIN"),
  asyncHandler(bookingRequestController.approveBookingRequest),
);
router.patch(
  "/booking-requests/reject/:id",
  authorizeRoles("MANAGER", "ADMIN"),
  asyncHandler(bookingRequestController.rejectBookingRequest),
);
router.get(
  "/booking-requests/:id",
  asyncHandler(bookingRequestController.getBookingRequestById),
);

export default router;
