import express from "express";
const router = express.Router();
import { accessController } from "../../container/access.container";
import { asyncHandler } from "../../helper/asyncHandler";

router.post("/auth/signup", asyncHandler(accessController.signUp));
router.post("/auth/login", asyncHandler(accessController.login));
router.post("/auth/logout", asyncHandler(accessController.logout));
router.post(
  "/auth/refresh-token",
  asyncHandler(accessController.handleRefreshToken),
);

export default router;
