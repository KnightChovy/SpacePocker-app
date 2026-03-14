import express from "express";
import { feedbackController } from "../../container/feedback.container";
import { asyncHandler } from "../../helper/asyncHandler";
import { authentication, authorizeRoles } from "../../auth/authUtils";
import "../../docs/feedback.doc";

const router = express.Router();

// Public route - anyone can view feedbacks
router.get("/feedback", asyncHandler(feedbackController.getFeedbacks));

router.post(
  "/feedback",
  authentication,
  authorizeRoles("USER"),
  asyncHandler(feedbackController.createFeedback),
);

export default router;
