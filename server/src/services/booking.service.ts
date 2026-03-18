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
    const safeOffset = !isNaN(parsedOffset) && parsedOffset >= 0 ? parsedOffset : 0;

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

  async managerCancelPaidBookingAndNotifyRefund(
    id: string,
    managerId: string,
    reason?: string,
  ) {
    if (!id || id.trim() === "") {
      throw new BadRequestError("Booking id is required");
    }

    if (!managerId || managerId.trim() === "") {
      throw new BadRequestError("Manager ID is required");
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
      throw new ConflictRequestError("Booking was already cancelled");
    }

    if (booking.status !== "COMPLETED") {
      throw new ConflictRequestError(
        "Only paid/completed bookings can be cancelled with refund",
      );
    }

    const updatedBooking = await prisma.$transaction(async (tx) => {
      const cancelledBooking = await tx.booking.update({
        where: { id: booking.id },
        data: {
          status: "CANCELLED",
        },
        include: {
          user: true,
          room: true,
        },
      });

      await tx.bookingRequest.updateMany({
        where: {
          userId: booking.userId,
          roomId: booking.roomId,
          startTime: booking.startTime,
          endTime: booking.endTime,
          status: "COMPLETED",
        },
        data: {
          status: "CANCELLED",
        },
      });

      return cancelledBooking;
    });

    const durationHours =
      (booking.endTime.getTime() - booking.startTime.getTime()) / (1000 * 60 * 60);
    const refundAmount = Math.max(0, booking.room.pricePerHour * durationHours);

    await this.mailQueueService.publishBookingRefundSuccessEmailJob({
      to: booking.user.email,
      customerName: booking.user.name,
      bookingId: booking.id,
      roomName: booking.room.name,
      refundAmount,
      refundReason: reason,
    });

    return {
      booking: updatedBooking,
      refund: {
        amount: refundAmount,
        reason: reason ?? null,
        status: "SUCCESS",
      },
    };
  }
}
