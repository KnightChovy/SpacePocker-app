import express from "express";
import { userController } from "../../container/user.container";
import { asyncHandler } from "../../helper/asyncHandler";
import { authentication, authorizeRoles } from "../../auth/authUtils";
import "../../docs/user.doc";

const router = express.Router();

router.use(authentication);

// User can get their own profile
router.get("/users/profile", asyncHandler(userController.getUserProfile));
router.patch("/users/profile", asyncHandler(userController.updateUserProfile));

// Admin and Manager can get list of users
router.get(
  "/users",
  authorizeRoles("ADMIN", "MANAGER"),
  asyncHandler(userController.getUsers),
);

export default router;
