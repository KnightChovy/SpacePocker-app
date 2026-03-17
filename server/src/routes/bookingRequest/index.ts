import express from "express";
import { bookingRequestController } from "../../container/bookingRequest.container";
import { asyncHandler } from "../../helper/asyncHandler";
import { authentication, authorizeRoles } from "../../auth/authUtils";

const router = express.Router();

router.post(
  "/booking-requests",
  authentication,
  asyncHandler(bookingRequestController.createBookingRequest),
);
router.post(
  "/booking-requests/:id/payment-url",
  authentication,
  authorizeRoles("USER"),
  asyncHandler(bookingRequestController.createBookingRequestPaymentUrl),
);
router.get(
  "/my-booking-requests",
  authentication,
  authorizeRoles("USER"),
  asyncHandler(bookingRequestController.getMyBookingRequests),
);
router.get(
  "/booking-requests",
  authentication,
  authorizeRoles("MANAGER", "ADMIN"),
  asyncHandler(bookingRequestController.getBookingRequestsForManager),
);
router.get(
  "/allBookingRequest",
  authentication,
  authorizeRoles("ADMIN"),
  asyncHandler(bookingRequestController.getAllBookingRequestsForAdmin),
);
router.patch(
  "/booking-requests/approve/:id",
  authentication,
  authorizeRoles("MANAGER", "ADMIN"),
  asyncHandler(bookingRequestController.approveBookingRequest),
);
router.patch(
  "/booking-requests/reject/:id",
  authentication,
  authorizeRoles("MANAGER", "ADMIN"),
  asyncHandler(bookingRequestController.rejectBookingRequest),
);
router.get(
  "/booking-requests/:id",
  authentication,
  asyncHandler(bookingRequestController.getBookingRequestById),
);
router.get(
  "/payment/vnpay-return",
  asyncHandler(bookingRequestController.handleVnpayReturn),
);
router.get(
  "/payment/vnpay-ipn",
  asyncHandler(bookingRequestController.handleVnpayIpn),
);

export default router;
