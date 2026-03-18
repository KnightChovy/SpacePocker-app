import BookingController from "../controllers/booking.controller";
import BookingService from "../services/booking.service";
import MailQueueService from "../services/mailQueue.service";

const mailQueueService = new MailQueueService();
const bookingService = new BookingService(mailQueueService);

export const bookingController = new BookingController(bookingService);
