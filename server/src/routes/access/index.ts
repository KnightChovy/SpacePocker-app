import express from 'express';
const router = express.Router();
import { accessController } from '../../container/access.container';
import { asyncHandler } from '../../helper/asyncHandler';

router.post('/auth/signup', asyncHandler(accessController.signUp));
router.post('/auth/login', asyncHandler(accessController.login));
router.post(
  '/auth/forgot-password',
  asyncHandler(accessController.forgotPassword),
);
router.post(
  '/auth/verify-forgot-password-otp',
  asyncHandler(accessController.verifyForgotPasswordOtp),
);
router.post(
  '/auth/reset-password',
  asyncHandler(accessController.resetPassword),
);
router.post('/auth/logout', asyncHandler(accessController.logout));
router.post(
  '/auth/refresh-token',
  asyncHandler(accessController.handleRefreshToken),
);

export default router;
