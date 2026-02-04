import express from "express";
const router = express.Router();
import { accessController } from "../../container/access.container";
import { asyncHandler } from "../../helper/asyncHandler";
router.post(
  "/refresh-token",
  asyncHandler(accessController.handleRefreshToken)
);
router.post("/logout", asyncHandler(accessController.logout));
router.post("/signup", asyncHandler(accessController.signUp));

export default router;
