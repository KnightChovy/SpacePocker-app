import express from "express";
import { bookingController } from "../../container/booking.container";
import { asyncHandler } from "../../helper/asyncHandler";
import { authentication, authorizeRoles } from "../../auth/authUtils";

const router = express.Router();

router.get(
  "/bookings",
  authentication,
  authorizeRoles("MANAGER", "ADMIN"),
  asyncHandler(bookingController.getAllBookings),
);

router.get(
  "/myBookings",
  authentication,
  asyncHandler(bookingController.getMyBookings),
);

router.patch(
  "/updateBookings/:id",
  authentication,
  authorizeRoles("MANAGER", "ADMIN"),
  asyncHandler(bookingController.updateBooking),
);

router.patch(
  "/cancelBookings/:id",
  authentication,
  asyncHandler(bookingController.cancelBooking),
);

export default router;
