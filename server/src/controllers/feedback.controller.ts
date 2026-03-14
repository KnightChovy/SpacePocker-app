import { Request, Response, NextFunction } from "express";
import FeedbackService from "../services/feedback.service";
import { Created, OK } from "../core/success.response";

class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}

  createFeedback = async (req: Request, res: Response, next: NextFunction) => {
    new Created({
      message: "Feedback created successfully",
      metadata: await this.feedbackService.createFeedback({
        userId: req.user?.userId,
        ...req.body,
      }),
    }).send(res);
  };

  getFeedbacks = async (req: Request, res: Response, next: NextFunction) => {
    const { roomId, page, limit } = req.query;

    new OK({
      message: "Get feedbacks successfully",
      metadata: await this.feedbackService.getFeedbacks({
        roomId: roomId ? String(roomId) : undefined,
        page: page ? parseInt(String(page)) : undefined,
        limit: limit ? parseInt(String(limit)) : undefined,
      }),
    }).send(res);
  };
}

export default FeedbackController;
