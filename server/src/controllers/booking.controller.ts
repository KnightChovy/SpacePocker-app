import { Request, Response, NextFunction } from "express";
import { OK } from "../core/success.response";
import BookingService from "../services/booking.service";

class BookingController {
  constructor(private bookingService: BookingService) {}

  getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
    new OK({
      message: "Get all bookings successfully",
      metadata: await this.bookingService.getAllBookings(req.query),
    }).send(res);
  };

  getMyBookings = async (req: Request, res: Response, next: NextFunction) => {
    new OK({
      message: "Get my bookings successfully",
      metadata: await this.bookingService.getMyBookings(
        String(req.user?.userId),
      ),
    }).send(res);
  };

  updateBooking = async (req: Request, res: Response, next: NextFunction) => {
    new OK({
      message: "Booking updated successfully",
      metadata: await this.bookingService.updateBooking(
        String(req.params.id),
        req.body,
      ),
    }).send(res);
  };

  cancelBooking = async (req: Request, res: Response, next: NextFunction) => {
    new OK({
      message: "Booking cancelled successfully",
      metadata: await this.bookingService.cancelBooking(
        String(req.params.id),
        String(req.user?.userId),
        String(req.user?.role),
      ),
    }).send(res);
  };

  userCancelBooking = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    new OK({
      message: "Booking cancelled successfully. Notification email sent.",
      metadata: await this.bookingService.userCancelBooking(
        String(req.params.id),
        String(req.user?.userId),
      ),
    }).send(res);
  };

  userCancelBookingByRequestId = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    new OK({
      message: "Booking cancelled successfully. Notification email sent.",
      metadata: await this.bookingService.userCancelBookingByRequestId(
        String(req.params.bookingRequestId),
        String(req.user?.userId),
      ),
    }).send(res);
  };

  managerCancelPaidBookingAndNotifyRefund = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const bookingRequestId = String(req.params.id);
    const managerId = String(req.user?.userId);
    const role = String(req.user?.role);
    const reason =
      typeof req.body?.reason === "string" ? req.body.reason : undefined;

    new OK({
      message: "Booking cancelled and refund email queued successfully",
      metadata:
        await this.bookingService.managerCancelPaidBookingAndNotifyRefund(
          bookingRequestId,
          managerId,
          role,
          reason,
        ),
    }).send(res);
  };
}

export default BookingController;
