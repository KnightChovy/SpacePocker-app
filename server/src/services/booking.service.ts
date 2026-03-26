import { BookingStatus, Prisma } from "@prisma/client";
import {
  BadRequestError,
  ConflictRequestError,
  ForbiddenError,
  NotFoundError,
} from "../core/error.response";
import { prisma } from "../lib/prisma";
import MailQueueService from "./mailQueue.service";

type UpdateBookingInput = {
  userId?: string;
  roomId?: string;
  startTime?: string;
  endTime?: string;
  purpose?: string;
  status?: BookingStatus;
};

export default class BookingService {
  constructor(private readonly mailQueueService: MailQueueService) {}

  private readonly allowedStatus: BookingStatus[] = [
    "PENDING",
    "APPROVED",
    "REJECTED",
    "CANCELLED",
    "COMPLETED",
  ];

  private validateStatus(status?: BookingStatus) {
    if (!status) {
      return;
    }

    if (!this.allowedStatus.includes(status)) {
      throw new BadRequestError("Invalid booking status");
    }
  }

  private parseDate(value: string, fieldName: string) {
    const parsedDate = new Date(value);
    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestError(
        `${fieldName} must be a valid ISO 8601 date string`,
      );
    }
    return parsedDate;
  }

  private async ensureUserAndRoomExist(userId: string, roomId: string) {
    const [user, room] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { id: true } }),
      prisma.room.findUnique({
        where: { id: roomId },
        select: { id: true, status: true, name: true },
      }),
    ]);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (!room) {
      throw new NotFoundError("Room not found");
    }

    if (room.status !== "AVAILABLE") {
      throw new BadRequestError(
        `Room '${room.name}' is currently not available for booking`,
      );
    }
  }

  private async checkBookingOverlap(
    roomId: string,
    startTime: Date,
    endTime: Date,
    excludeBookingId?: string,
  ) {
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        roomId,
        status: "APPROVED",
        ...(excludeBookingId && {
          id: {
            not: excludeBookingId,
          },
        }),
        AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
      },
    });

    if (overlappingBooking) {
      throw new ConflictRequestError(
        `Room is already booked from ${overlappingBooking.startTime.toISOString()} to ${overlappingBooking.endTime.toISOString()}`,
      );
    }
  }

  async getAllBookings(query: Record<string, unknown>) {
    const { userId, roomId, status, limit, offset } = query;

    const where: Prisma.BookingWhereInput = {};

    if (typeof userId === "string" && userId.trim() !== "") {
      where.userId = userId;
    }

    if (typeof roomId === "string" && roomId.trim() !== "") {
      where.roomId = roomId;
    }

    if (typeof status === "string" && status.trim() !== "") {
      const normalizedStatus = status.toUpperCase() as BookingStatus;
      this.validateStatus(normalizedStatus);
      where.status = normalizedStatus;
    }

    const parsedLimit = limit ? parseInt(String(limit), 10) : 10;
    const parsedOffset = offset ? parseInt(String(offset), 10) : 0;

    const safeLimit =
      !isNaN(parsedLimit) && parsedLimit > 0 && parsedLimit <= 100
        ? parsedLimit
        : 10;
    const safeOffset =
      !isNaN(parsedOffset) && parsedOffset >= 0 ? parsedOffset : 0;

    const [total, bookings] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
          room: true,
        },
        take: safeLimit,
        skip: safeOffset,
      }),
    ]);

    return {
      bookings,
      pagination: {
        total,
        limit: safeLimit,
        offset: safeOffset,
        hasMore: safeOffset + safeLimit < total,
      },
      filters: {
        userId: typeof userId === "string" ? userId : null,
        roomId: typeof roomId === "string" ? roomId : null,
        status: typeof status === "string" ? status : null,
      },
    };
  }

  async getMyBookings(userId: string) {
    if (!userId || userId.trim() === "") {
      throw new BadRequestError("User ID is required");
    }

    const bookings = await prisma.booking.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        room: true,
      },
    });

    return { bookings };
  }

  async updateBooking(id: string, data: UpdateBookingInput) {
    if (!id || id.trim() === "") {
      throw new BadRequestError("Booking id is required");
    }

    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      throw new NotFoundError("Booking not found");
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestError("No data provided for update");
    }

    this.validateStatus(data.status);

    const nextUserId = data.userId ?? existingBooking.userId;
    const nextRoomId = data.roomId ?? existingBooking.roomId;
    const nextStartTime = data.startTime
      ? this.parseDate(data.startTime, "startTime")
      : existingBooking.startTime;
    const nextEndTime = data.endTime
      ? this.parseDate(data.endTime, "endTime")
      : existingBooking.endTime;

    if (nextStartTime >= nextEndTime) {
      throw new BadRequestError("endTime must be greater than startTime");
    }

    await this.ensureUserAndRoomExist(nextUserId, nextRoomId);
    await this.checkBookingOverlap(nextRoomId, nextStartTime, nextEndTime, id);

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        userId: data.userId,
        roomId: data.roomId,
        startTime: data.startTime ? nextStartTime : undefined,
        endTime: data.endTime ? nextEndTime : undefined,
        purpose: data.purpose,
        status: data.status,
      },
      include: {
        user: true,
        room: true,
      },
    });

    return { booking };
  }

  async cancelBooking(id: string, requestedByUserId: string, userRole: string) {
    if (!id || id.trim() === "") {
      throw new BadRequestError("Booking id is required");
    }
    if (!requestedByUserId || requestedByUserId.trim() === "") {
      throw new BadRequestError("User ID is required");
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        room: true,
      },
    });

    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    if (booking.status === "CANCELLED") {
      return { booking };
    }

    const isElevatedRole = userRole === "ADMIN" || userRole === "MANAGER";
    if (!isElevatedRole && booking.userId !== requestedByUserId) {
      throw new ForbiddenError("You are not allowed to cancel this booking");
    }

    if (booking.status === "COMPLETED") {
      throw new BadRequestError("Completed booking cannot be cancelled");
    }

    if (booking.status === "CHECKED_IN") {
      throw new BadRequestError(
        "Cannot cancel a booking that is currently checked in",
      );
    }

    const cancelledBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: "CANCELLED",
      },
      include: {
        user: true,
        room: true,
      },
    });

    return { booking: cancelledBooking };
  }

  async userCancelBooking(id: string, userId: string) {
    if (!id || id.trim() === "") {
      throw new BadRequestError("Booking ID is required");
    }

    if (!userId || userId.trim() === "") {
      throw new BadRequestError("User ID is required");
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        room: true,
      },
    });

    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    if (booking.userId !== userId) {
      throw new ForbiddenError("You are not allowed to cancel this booking");
    }

    if (booking.status === "CANCELLED") {
      throw new BadRequestError("Booking is already cancelled");
    }

    // Only allow cancelling if status is APPROVED, COMPLETED or PENDING
    // Based on requirement: "cancel booking đã thanh toán cọc" -> APPROVED and COMPLETED
    if (
      booking.status !== "APPROVED" &&
      booking.status !== "PENDING" &&
      booking.status !== "COMPLETED"
    ) {
      throw new BadRequestError(
        "Only PENDING, APPROVED or COMPLETED bookings can be cancelled by user",
      );
    }

    // Check if booking has already started
    if (new Date() > booking.startTime) {
      throw new BadRequestError(
        "Cannot cancel a booking that has already started",
      );
    }

    const cancelledBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: "CANCELLED",
      },
      include: {
        user: true,
        room: true,
      },
    });

    // Send email notification regarding no refund for APPROVED and COMPLETED bookings
    if (booking.status === "APPROVED" || booking.status === "COMPLETED") {
      await this.mailQueueService.publishBookingCancelledNoRefundEmailJob({
        to: booking.user.email,
        customerName: booking.user.name,
        bookingId: booking.id,
        roomName: booking.room.name,
        startTime: booking.startTime.toISOString(),
        endTime: booking.endTime.toISOString(),
      });
    }

    return { booking: cancelledBooking };
  }

  async userCancelBookingByRequestId(bookingRequestId: string, userId: string) {
    if (!bookingRequestId || bookingRequestId.trim() === "") {
      throw new BadRequestError("Booking Request ID is required");
    }

    if (!userId || userId.trim() === "") {
      throw new BadRequestError("User ID is required");
    }

    const booking = await prisma.booking.findFirst({
      where: {
        transaction: {
          bookingRequestId: bookingRequestId,
        },
        userId,
      },
    });

    if (!booking) {
      throw new NotFoundError("Booking associated with this request not found");
    }

    return this.userCancelBooking(booking.id, userId);
  }

  async managerCancelPaidBookingAndNotifyRefund(
    bookingRequestId: string,
    requestedByUserId: string,
    requestedByRole: string,
    reason?: string,
  ) {
    if (!bookingRequestId || bookingRequestId.trim() === "") {
      throw new BadRequestError("Booking request id is required");
    }

    if (!requestedByUserId || requestedByUserId.trim() === "") {
      throw new BadRequestError("Manager ID is required");
    }

    const bookingRequest = await prisma.bookingRequest.findUnique({
      where: { id: bookingRequestId },
      include: {
        user: true,
        room: {
          select: {
            id: true,
            name: true,
            managerId: true,
            pricePerHour: true,
          },
        },
      },
    });

    if (!bookingRequest) {
      throw new NotFoundError("Booking request not found");
    }

    if (bookingRequest.status === "CHECKED_IN") {
      throw new BadRequestError(
        "Cannot cancel a booking that is currently checked in",
      );
    }

    const checkInRecord = await prisma.checkInRecord.findUnique({
      where: { bookingRequestId },
    });

    if (bookingRequest.status === "COMPLETED" && checkInRecord?.checkedOutAt) {
      throw new BadRequestError(
        "Cannot cancel a booking that has already checked out",
      );
    }

    const isManagerOrAdmin =
      requestedByRole === "ADMIN" || requestedByRole === "MANAGER";
    if (!isManagerOrAdmin) {
      throw new ForbiddenError(
        "Only MANAGER or ADMIN can cancel this booking request",
      );
    }

    const matchedBooking = await prisma.booking.findFirst({
      where: {
        userId: bookingRequest.userId,
        roomId: bookingRequest.roomId,
        startTime: bookingRequest.startTime,
        endTime: bookingRequest.endTime,
      },
      include: {
        user: true,
        room: true,
      },
    });

    if (
      bookingRequest.status === "CANCELLED" &&
      (!matchedBooking || matchedBooking.status === "CANCELLED")
    ) {
      throw new ConflictRequestError("Booking request was already cancelled");
    }

    const previousBookingStatus = matchedBooking?.status;

    const { cancelledBookingRequest, cancelledBooking } =
      await prisma.$transaction(async (tx) => {
        const requestAfterCancel =
          bookingRequest.status === "CANCELLED"
            ? bookingRequest
            : await tx.bookingRequest.update({
                where: { id: bookingRequest.id },
                data: {
                  status: "CANCELLED",
                },
                include: {
                  user: true,
                  room: {
                    select: {
                      id: true,
                      name: true,
                      managerId: true,
                      pricePerHour: true,
                    },
                  },
                },
              });

        let bookingAfterCancel = matchedBooking;

        if (matchedBooking && matchedBooking.status !== "CANCELLED") {
          bookingAfterCancel = await tx.booking.update({
            where: { id: matchedBooking.id },
            data: {
              status: "CANCELLED",
            },
            include: {
              user: true,
              room: true,
            },
          });
        }

        return {
          cancelledBookingRequest: requestAfterCancel,
          cancelledBooking: bookingAfterCancel,
        };
      });

    const isCompletedCancellation = previousBookingStatus === "COMPLETED";
    const refundAmount =
      isCompletedCancellation && cancelledBooking
        ? Math.max(
            0,
            cancelledBooking.room.pricePerHour *
              ((cancelledBooking.endTime.getTime() -
                cancelledBooking.startTime.getTime()) /
                (1000 * 60 * 60)),
          )
        : 0;

    if (isCompletedCancellation && cancelledBooking) {
      await this.mailQueueService.publishBookingRefundSuccessEmailJob({
        to: cancelledBooking.user.email,
        customerName: cancelledBooking.user.name,
        bookingId: cancelledBooking.id,
        roomName: cancelledBooking.room.name,
        refundAmount,
        refundReason: reason,
      });
    }

    return {
      bookingRequest: cancelledBookingRequest,
      booking: cancelledBooking,
      refund: {
        amount: refundAmount,
        reason: reason ?? null,
        status: isCompletedCancellation ? "SUCCESS" : "NOT_APPLICABLE",
      },
    };
  }
}
