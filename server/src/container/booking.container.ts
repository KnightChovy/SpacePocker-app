import BookingController from "../controllers/booking.controller";
import BookingService from "../services/booking.service";

const bookingService = new BookingService();

export const bookingController = new BookingController(bookingService);
