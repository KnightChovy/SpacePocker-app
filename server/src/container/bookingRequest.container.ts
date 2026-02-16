import { BookingRequestRepository } from '../repository/bookingRequest.repository';
import BookingRequestService from '../services/bookingRequest.service';
import BookingRequestController from '../controllers/bookingRequest.controller';
import { RoomRepository } from '../repository/room.repository';
import { BookingRepository } from '../repository/booking.repository';

const bookingRequestRepo = new BookingRequestRepository();
const roomRepo = new RoomRepository();
const bookingRepo = new BookingRepository();

const bookingRequestService = new BookingRequestService(
  bookingRequestRepo,
  roomRepo,
  bookingRepo,
);

export const bookingRequestController = new BookingRequestController(
  bookingRequestService,
);
