import express from "express";
const router = express.Router();
import AccessController from "../../controllers/access.controller";
import { asyncHandler } from "../../helper/asyncHandler";
router.post("/login", asyncHandler(AccessController.login));
router.post(
  "/refresh-token",
  asyncHandler(AccessController.handleRefreshToken)
);
router.post("/logout", asyncHandler(AccessController.logout));
router.post("/signup", asyncHandler(AccessController.signUp));

export default router;
