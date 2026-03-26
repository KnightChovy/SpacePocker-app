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
    bookingId: string,
    userId: string,
    userRole: string,
    method: CheckInMethod = "MANUAL",
    note?: string,
  ) {
    if (!bookingId || bookingId.trim() === "") {
      throw new BadRequestError("Booking id is required");
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { room: true, user: true },
    });

    if (!booking) throw new NotFoundError("Booking not found");

    const isElevated = userRole === "ADMIN" || userRole === "MANAGER";
    if (!isElevated && booking.userId !== userId) {
      throw new ForbiddenError("You are not allowed to check in this booking");
    }

    if (booking.status !== "APPROVED") {
      throw new BadRequestError(
        `Cannot check in: booking status is ${booking.status}`,
      );
    }

    const now = new Date();
    const earliestCheckIn = new Date(
      booking.startTime.getTime() - CHECKIN_EARLY_MINUTES * 60 * 1000,
    );

    if (now < earliestCheckIn) {
      throw new BadRequestError(
        `Check-in is only allowed from ${earliestCheckIn.toISOString()} (${CHECKIN_EARLY_MINUTES} minutes before start time)`,
      );
    }

    if (now > booking.endTime) {
      throw new BadRequestError("Cannot check in: booking period has already ended");
    }

    const existing = await prisma.checkInRecord.findUnique({
      where: { bookingId },
    });
    if (existing) {
      throw new ConflictRequestError("Already checked in for this booking");
    }

    const [checkInRecord, updatedBooking] = await prisma.$transaction([
      prisma.checkInRecord.create({
        data: {
          bookingId,
          checkedInBy: userId,
          method,
          note,
        },
      }),
      prisma.booking.update({
        where: { id: bookingId },
        data: { status: "CHECKED_IN" },
        include: { room: true, user: true },
      }),
    ]);

    return { checkInRecord, booking: updatedBooking };
  }

  async checkOut(
    bookingId: string,
    userId: string,
    userRole: string,
    note?: string,
  ) {
    if (!bookingId || bookingId.trim() === "") {
      throw new BadRequestError("Booking id is required");
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { room: true, user: true },
    });

    if (!booking) throw new NotFoundError("Booking not found");

    const isElevated = userRole === "ADMIN" || userRole === "MANAGER";
    if (!isElevated && booking.userId !== userId) {
      throw new ForbiddenError("You are not allowed to check out this booking");
    }

    if (booking.status !== "CHECKED_IN") {
      throw new BadRequestError(
        `Cannot check out: booking status is ${booking.status}`,
      );
    }

    const checkInRecord = await prisma.checkInRecord.findUnique({
      where: { bookingId },
    });
    if (!checkInRecord) {
      throw new NotFoundError("Check-in record not found");
    }
    if (checkInRecord.checkedOutAt) {
      throw new ConflictRequestError("Already checked out for this booking");
    }

    const now = new Date();
    let overstayMinutes = 0;
    let overstayFee = 0;

    if (now > booking.endTime) {
      overstayMinutes = Math.ceil(
        (now.getTime() - booking.endTime.getTime()) / (1000 * 60),
      );
      overstayFee = (overstayMinutes / 60) * booking.room.pricePerHour;
    }

    const [updatedRecord, updatedBooking] = await prisma.$transaction([
      prisma.checkInRecord.update({
        where: { bookingId },
        data: {
          checkedOutAt: now,
          note: note ?? checkInRecord.note,
          overstayMinutes: overstayMinutes > 0 ? overstayMinutes : undefined,
          overstayFee: overstayFee > 0 ? overstayFee : undefined,
        },
      }),
      prisma.booking.update({
        where: { id: bookingId },
        data: { status: "COMPLETED" },
        include: { room: true, user: true },
      }),
    ]);

    return {
      checkInRecord: updatedRecord,
      booking: updatedBooking,
      overstay:
        overstayMinutes > 0
          ? { minutes: overstayMinutes, fee: overstayFee }
          : null,
    };
  }

  async getCheckInStatus(
    bookingId: string,
    userId: string,
    userRole: string,
  ) {
    if (!bookingId || bookingId.trim() === "") {
      throw new BadRequestError("Booking id is required");
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        room: { select: { id: true, name: true } },
        checkInRecord: true,
      },
    });

    if (!booking) throw new NotFoundError("Booking not found");

    const isElevated = userRole === "ADMIN" || userRole === "MANAGER";
    if (!isElevated && booking.userId !== userId) {
      throw new ForbiddenError(
        "You are not allowed to view this check-in status",
      );
    }

    return {
      booking: {
        id: booking.id,
        status: booking.status,
        startTime: booking.startTime,
        endTime: booking.endTime,
        room: booking.room,
      },
      checkInRecord: booking.checkInRecord ?? null,
    };
  }
}
