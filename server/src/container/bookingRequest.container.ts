import { BookingRequestRepository } from '../repository/bookingRequest.repository';
import BookingRequestService from '../services/bookingRequest.service';
import BookingRequestController from '../controllers/bookingRequest.controller';

const bookingRequestRepo = new BookingRequestRepository();

const bookingRequestService = new BookingRequestService(bookingRequestRepo);

export const bookingRequestController = new BookingRequestController(
  bookingRequestService,
);
