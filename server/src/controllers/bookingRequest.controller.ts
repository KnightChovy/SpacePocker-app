import { Request, Response, NextFunction } from 'express';
import { BookingStatus } from '@prisma/client';
import BookingRequestService from '../services/bookingRequest.service';
import { Created, OK } from '../core/success.response';

class BookingRequestController {
  constructor(private bookingRequestService: BookingRequestService) {}

  private getStatusFromQuery(status?: string): BookingStatus {
    const normalized = status?.toUpperCase();
    const allowedStatus: BookingStatus[] = [
      'PENDING',
      'APPROVED',
      'REJECTED',
      'CANCELLED',
      'COMPLETED',
    ];

    if (!normalized || !allowedStatus.includes(normalized as BookingStatus)) {
      return 'PENDING';
    }

    return normalized as BookingStatus;
  }

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

  getMyBookingRequests = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const status = req.query.status
      ? this.getStatusFromQuery(String(req.query.status))
      : undefined;

    new OK({
      message: 'Get my booking requests successfully',
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
      message: 'Get booking requests successfully',
      metadata: await this.bookingRequestService.getBookingRequestsForManager(
        String(req.user?.userId),
        String(req.user?.email || ''),
        this.getStatusFromQuery(String(req.query.status || 'PENDING')),
      ),
    }).send(res);
  };

  getAllBookingRequestsForAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    new OK({
      message: 'Get all booking requests successfully',
      metadata: await this.bookingRequestService.getAllBookingRequestsForAdmin(
        String(req.user?.userId),
      ),
    }).send(res);
  };

  approveBookingRequest = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    new OK({
      message: 'Booking request approved successfully',
      metadata: await this.bookingRequestService.approveBookingRequest(
        String(req.params.id),
        String(req.user?.userId),
        String(req.user?.email || ''),
      ),
    }).send(res);
  };

  rejectBookingRequest = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    new OK({
      message: 'Booking request rejected successfully',
      metadata: await this.bookingRequestService.rejectBookingRequest(
        String(req.params.id),
        String(req.user?.userId),
        String(req.user?.email || ''),
      ),
    }).send(res);
  };

  cancelMyBookingRequest = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    new OK({
      message: 'Booking request cancelled successfully',
      metadata: await this.bookingRequestService.cancelMyBookingRequest(
        String(req.params.id),
        String(req.user?.userId),
      ),
    }).send(res);
  };

  createBookingRequestPaymentUrl = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const ipAddr =
      (req.headers['x-forwarded-for'] as string | undefined)
        ?.split(',')[0]
        ?.trim() ||
      req.socket.remoteAddress ||
      '127.0.0.1';

    new OK({
      message: 'Create VNPAY payment URL successfully',
      metadata:
        await this.bookingRequestService.createPaymentUrlForApprovedBookingRequest(
          {
            bookingRequestId: String(req.params.id),
            userId: String(req.user?.userId),
            ipAddr,
            locale: req.body?.locale === 'en' ? 'en' : 'vn',
          },
        ),
    }).send(res);
  };

  createMobileBookingRequestAndPaymentUrl = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const rawIp =
      (req.headers['x-forwarded-for'] as string | undefined)
        ?.split(',')[0]
        ?.trim() ||
      req.socket.remoteAddress ||
      '127.0.0.1';
    // Strip IPv6-mapped IPv4 prefix (e.g. "::ffff:192.168.1.1" → "192.168.1.1")
    const ipAddr = rawIp.replace(/^::ffff:/, '');

    new Created({
      message: 'Create booking request and VNPAY payment URL successfully',
      metadata:
        await this.bookingRequestService.createBookingRequestAndPaymentUrlForMobile(
          {
            userId: String(req.user?.userId),
            roomId: String(req.body?.roomId),
            startTime: String(req.body?.startTime),
            endTime: String(req.body?.endTime),
            purpose: req.body?.purpose,
            amenityIds: req.body?.amenityIds,
            services: req.body?.services,
            ipAddr,
            locale: req.body?.locale === 'en' ? 'en' : 'vn',
          },
        ),
    }).send(res);
  };

  handleVnpayReturn = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const normalizedQuery: Record<string, string> = {};
    Object.entries(req.query).forEach(([key, value]) => {
      if (typeof value === 'string') normalizedQuery[key] = value;
      else if (Array.isArray(value) && value.length > 0) {
        normalizedQuery[key] = String(value[0]);
      }
    });

    const result =
      await this.bookingRequestService.processVnpayPayment(normalizedQuery);
    const clientUrl = process.env.CLIENT_URL || '';
    const status = result.success ? 'success' : 'failed';
    const redirectUrl = `${clientUrl}/user/bookings?paymentStatus=${status}&bookingRequestId=${result.bookingRequestId || ''}`;

    return res.redirect(redirectUrl);
  };

  handleVnpayIpn = async (req: Request, res: Response, next: NextFunction) => {
    const normalizedQuery: Record<string, string> = {};
    Object.entries(req.query).forEach(([key, value]) => {
      if (typeof value === 'string') normalizedQuery[key] = value;
      else if (Array.isArray(value) && value.length > 0) {
        normalizedQuery[key] = String(value[0]);
      }
    });

    const result =
      await this.bookingRequestService.processVnpayPayment(normalizedQuery);

    if (result.success) {
      return res
        .status(200)
        .json({ RspCode: '00', Message: 'Confirm Success' });
    }

    return res.status(200).json({
      RspCode: result.code || '99',
      Message: result.message || 'Payment failed',
    });
  };
}

export default BookingRequestController;
