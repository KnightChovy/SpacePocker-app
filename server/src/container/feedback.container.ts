import { FeedbackRepository } from "../repository/feedback.repository";
import { BookingRepository } from "../repository/booking.repository";
import FeedbackService from "../services/feedback.service";
import FeedbackController from "../controllers/feedback.controller";

const feedbackRepo = new FeedbackRepository();
const bookingRepo = new BookingRepository();

const feedbackService = new FeedbackService(feedbackRepo, bookingRepo);

export const feedbackController = new FeedbackController(feedbackService);
