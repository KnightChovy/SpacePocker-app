import { CheckInMethod } from "@prisma/client";
import {
  BadRequestError,
  ConflictRequestError,
  ForbiddenError,
  NotFoundError,
} from "../core/error.response";
import { prisma } from "../lib/prisma";

const CHECKIN_EARLY_MINUTES = 15;

export default class CheckInService {
  async checkIn(
    bookingRequestId: string,
    userId: string,
    userRole: string,
    method: CheckInMethod = "MANUAL",
    note?: string,
  ) {
    if (!bookingRequestId || bookingRequestId.trim() === "") {
      throw new BadRequestError("Booking request id is required");
    }

    const bookingRequest = await prisma.bookingRequest.findUnique({
      where: { id: bookingRequestId },
      include: { room: true, user: true },
    });

    if (!bookingRequest) throw new NotFoundError("Booking request not found");

    const isElevated = userRole === "ADMIN" || userRole === "MANAGER";
    if (!isElevated && bookingRequest.userId !== userId) {
      throw new ForbiddenError("You are not allowed to check in this booking/request");
    }

    if (bookingRequest.status !== "COMPLETED") {
      throw new BadRequestError(
        `Cannot check in: booking request status is ${bookingRequest.status}`,
      );
    }

    const now = new Date();
    const earliestCheckIn = new Date(
      bookingRequest.startTime.getTime() - CHECKIN_EARLY_MINUTES * 60 * 1000,
    );
    const latestCheckIn = new Date(
      bookingRequest.startTime.getTime() + 30 * 60 * 1000,
    );

    if (now < earliestCheckIn) {
      throw new BadRequestError(
        `Check-in is only allowed from ${earliestCheckIn.toISOString()} (${CHECKIN_EARLY_MINUTES} minutes before start time)`,
      );
    }

    if (!isElevated && now > latestCheckIn) {
      throw new BadRequestError(
        "Cannot check in: check-in time has expired (more than 30 minutes after start time)",
      );
    }

    const existing = await prisma.checkInRecord.findUnique({
      where: { bookingRequestId },
    });
    if (existing) {
      throw new ConflictRequestError("Already checked in for this booking request");
    }

    const [checkInRecord, updatedBookingRequest] = await prisma.$transaction([
      prisma.checkInRecord.create({
        data: {
          bookingRequestId,
          checkedInBy: userId,
          method,
          note,
        },
      }),
      prisma.bookingRequest.update({
        where: { id: bookingRequestId },
        data: { status: "CHECKED_IN" },
        include: { room: true, user: true },
      }),
      prisma.room.update({
        where: { id: bookingRequest.roomId },
        data: { status: "PROCESS" },
      }),
    ]);

    return { checkInRecord, bookingRequest: updatedBookingRequest };
  }

  async checkOut(
    bookingRequestId: string,
    userId: string,
    userRole: string,
    note?: string,
  ) {
    if (!bookingRequestId || bookingRequestId.trim() === "") {
      throw new BadRequestError("Booking request id is required");
    }

    const bookingRequest = await prisma.bookingRequest.findUnique({
      where: { id: bookingRequestId },
      include: { room: true, user: true },
    });

    if (!bookingRequest) throw new NotFoundError("Booking request not found");

    const isElevated = userRole === "ADMIN" || userRole === "MANAGER";
    if (!isElevated && bookingRequest.userId !== userId) {
      throw new ForbiddenError("You are not allowed to check out this booking request");
    }

    if (bookingRequest.status !== "CHECKED_IN") {
      throw new BadRequestError(
        `Cannot check out: booking request status is ${bookingRequest.status}`,
      );
    }

    const checkInRecord = await prisma.checkInRecord.findUnique({
      where: { bookingRequestId },
    });
    if (!checkInRecord) {
      throw new NotFoundError("Check-in record not found");
    }
    if (checkInRecord.checkedOutAt) {
      throw new ConflictRequestError("Already checked out for this booking request");
    }

    const now = new Date();
    let overstayMinutes = 0;
    let overstayFee = 0;

    if (now > bookingRequest.endTime) {
      overstayMinutes = Math.ceil(
        (now.getTime() - bookingRequest.endTime.getTime()) / (1000 * 60),
      );
      if (bookingRequest.room.pricePerHour) {
        overstayFee = (overstayMinutes / 60) * bookingRequest.room.pricePerHour;
      }
    }

    const [updatedRecord, updatedBookingRequest] = await prisma.$transaction([
      prisma.checkInRecord.update({
        where: { bookingRequestId },
        data: {
          checkedOutAt: now,
          note: note ?? checkInRecord.note,
          overstayMinutes: overstayMinutes > 0 ? overstayMinutes : undefined,
          overstayFee: overstayFee > 0 ? overstayFee : undefined,
        },
      }),
      prisma.bookingRequest.update({
        where: { id: bookingRequestId },
        data: { status: "COMPLETED" },
        include: { room: true, user: true },
      }),
      prisma.room.update({
        where: { id: bookingRequest.roomId },
        data: { status: "AVAILABLE" },
      }),
    ]);

    return {
      checkInRecord: updatedRecord,
      bookingRequest: updatedBookingRequest,
      overstay:
        overstayMinutes > 0
          ? { minutes: overstayMinutes, fee: overstayFee }
          : null,
    };
  }

  async getCheckInStatus(bookingRequestId: string, userId: string, userRole: string) {
    if (!bookingRequestId || bookingRequestId.trim() === "") {
      throw new BadRequestError("Booking request id is required");
    }

    const bookingRequest = await prisma.bookingRequest.findUnique({
      where: { id: bookingRequestId },
      include: {
        room: { select: { id: true, name: true } },
        checkInRecord: true,
      },
    });

    if (!bookingRequest) throw new NotFoundError("Booking request not found");

    const isElevated = userRole === "ADMIN" || userRole === "MANAGER";
    if (!isElevated && bookingRequest.userId !== userId) {
      throw new ForbiddenError(
        "You are not allowed to view this check-in status",
      );
    }

    return {
      bookingRequest: {
        id: bookingRequest.id,
        status: bookingRequest.status,
        startTime: bookingRequest.startTime,
        endTime: bookingRequest.endTime,
        room: bookingRequest.room,
      },
      checkInRecord: bookingRequest.checkInRecord ?? null,
    };
  }
}
