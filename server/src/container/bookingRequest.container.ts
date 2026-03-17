import { BookingRequestRepository } from '../repository/bookingRequest.repository';
import BookingRequestService from '../services/bookingRequest.service';
import BookingRequestController from '../controllers/bookingRequest.controller';
import { RoomRepository } from '../repository/room.repository';
import { BookingRepository } from '../repository/booking.repository';
import MailQueueService from '../services/mailQueue.service';
import VnpayService from '../services/vnpay.service';

const bookingRequestRepo = new BookingRequestRepository();
const roomRepo = new RoomRepository();
const bookingRepo = new BookingRepository();
const mailQueueService = new MailQueueService();
const vnpayService = new VnpayService();

const bookingRequestService = new BookingRequestService(
  bookingRequestRepo,
  roomRepo,
  bookingRepo,
  mailQueueService,
  vnpayService,
);

export const bookingRequestController = new BookingRequestController(
  bookingRequestService,
);
