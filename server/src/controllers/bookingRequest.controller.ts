import { Request, Response, NextFunction } from "express";
import { BookingStatus } from "@prisma/client";
import BookingRequestService from "../services/bookingRequest.service";
import { Created, OK } from "../core/success.response";

class BookingRequestController {
  constructor(private bookingRequestService: BookingRequestService) {}

  private getStatusFromQuery(status?: string): BookingStatus {
    const normalized = status?.toUpperCase();
    const allowedStatus: BookingStatus[] = [
      "PENDING",
      "APPROVED",
      "REJECTED",
      "CANCELLED",
      "COMPLETED",
    ];

    if (!normalized || !allowedStatus.includes(normalized as BookingStatus)) {
      return "PENDING";
    }

    return normalized as BookingStatus;
  }

  createBookingRequest = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    new Created({
      message: "Booking request created successfully",
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
      message: " Get booking request successfully",
      metadata: await this.bookingRequestService.getBookingRequestById(
        String(req.params.id),
      ),
    }).send(res);
  };

  getMyBookingRequests = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const status = req.query.status
      ? this.getStatusFromQuery(String(req.query.status))
      : undefined;

    new OK({
      message: "Get my booking requests successfully",
      metadata: await this.bookingRequestService.getMyBookingRequests(
        String(req.user?.userId),
        status,
      ),
    }).send(res);
  };

  getBookingRequestsForManager = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    new OK({
      message: "Get booking requests successfully",
      metadata: await this.bookingRequestService.getBookingRequestsForManager(
        String(req.user?.userId),
        String(req.user?.email || ""),
        this.getStatusFromQuery(String(req.query.status || "PENDING")),
      ),
    }).send(res);
  };

  approveBookingRequest = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    new OK({
      message: "Booking request approved successfully",
      metadata: await this.bookingRequestService.approveBookingRequest(
        String(req.params.id),
        String(req.user?.userId),
        String(req.user?.email || ""),
      ),
    }).send(res);
  };

  rejectBookingRequest = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    new OK({
      message: "Booking request rejected successfully",
      metadata: await this.bookingRequestService.rejectBookingRequest(
        String(req.params.id),
        String(req.user?.userId),
        String(req.user?.email || ""),
      ),
    }).send(res);
  };
}

export default BookingRequestController;
