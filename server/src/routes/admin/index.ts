import express from "express";
import { adminController } from "../../container/admin.container";
import { asyncHandler } from "../../helper/asyncHandler";
import { authentication, authorizeRoles } from "../../auth/authUtils";
import "../../docs/admin.doc";

const router = express.Router();

router.use(authentication);
router.use(authorizeRoles("ADMIN"));

router.patch(
  "/admin/users/promote-manager/:userId",
  asyncHandler(adminController.promoteUserToManager),
);

export default router;
