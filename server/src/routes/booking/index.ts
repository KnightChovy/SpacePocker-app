import express from "express";
import { bookingController } from "../../container/booking.container";
import { checkInController } from "../../container/checkIn.container";
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

// New API for user to cancel paid booking (no refund)
router.patch(
  "/bookings/:id/cancel",
  authentication,
  asyncHandler(bookingController.userCancelBooking),
);

// New API for user to cancel paid booking by bookingRequestId
router.patch(
  "/bookings/request/:bookingRequestId/cancel",
  authentication,
  asyncHandler(bookingController.userCancelBookingByRequestId),
);

router.patch(
  "/manager/bookings/:id/refund-cancel",
  authentication,
  authorizeRoles("MANAGER", "ADMIN"),
  asyncHandler(bookingController.managerCancelPaidBookingAndNotifyRefund),
);

router.post(
  "/bookings/:id/check-in",
  authentication,
  asyncHandler(checkInController.checkIn),
);

router.post(
  "/bookings/:id/check-out",
  authentication,
  asyncHandler(checkInController.checkOut),
);

router.get(
  "/bookings/:id/check-in-status",
  authentication,
  asyncHandler(checkInController.getCheckInStatus),
);

export default router;
