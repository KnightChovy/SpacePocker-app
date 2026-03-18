import express from "express";
import { userController } from "../../container/user.container";
import { asyncHandler } from "../../helper/asyncHandler";
import { authentication, authorizeRoles } from "../../auth/authUtils";
import "../../docs/user.doc";

const router = express.Router();

// User can get their own profile
router.get(
  "/users/profile",
  authentication,
  asyncHandler(userController.getUserProfile),
);
router.patch(
  "/users/profile",
  authentication,
  asyncHandler(userController.updateUserProfile),
);
router.patch(
  "/users/change-password",
  authentication,
  asyncHandler(userController.changePassword),
);

// Admin and Manager can get list of users
router.get(
  "/users",
  authentication,
  authorizeRoles("ADMIN", "MANAGER"),
  asyncHandler(userController.getUsers),
);

export default router;
