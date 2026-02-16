import { Request, Response, NextFunction } from 'express';
import BookingRequestService from '../services/bookingRequest.service';
import { Created, OK } from '../core/success.response';

class BookingRequestController {
  constructor(private bookingRequestService: BookingRequestService) {}

  createBookingRequest = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    new Created({
      message: 'Booking request created successfully',
      metadata: await this.bookingRequestService.createBookingRequest({
        userId: req.user?.userId,
        ...req.body,
      }),
    }).send(res);
  };

  getBookingRequestById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    new OK({
      message: ' Get booking request successfully',
      metadata: await this.bookingRequestService.getBookingRequestById(
        String(req.params.id),
      ),
    }).send(res);
  };
}

export default BookingRequestController;
