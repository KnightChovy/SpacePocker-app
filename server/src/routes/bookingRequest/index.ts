import express from 'express';
import { bookingRequestController } from '../../container/bookingRequest.container';
import { asyncHandler } from '../../helper/asyncHandler';
import { authentication } from '../../auth/authUtils';

const router = express.Router();

router.use(authentication);

router.post(
  '/booking-requests',
  asyncHandler(bookingRequestController.createBookingRequest),
);
router.get(
  '/booking-requests/:id',
  asyncHandler(bookingRequestController.getBookingRequestById),
);

export default router;
