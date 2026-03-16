import BookingService from "../booking.service";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../core/error.response";

jest.mock("../../lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    room: {
      findUnique: jest.fn(),
    },
    booking: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

import { prisma } from "../../lib/prisma";

const prismaMock = prisma as unknown as {
  user: { findUnique: jest.Mock };
  room: { findUnique: jest.Mock };
  booking: {
    findFirst: jest.Mock;
    findMany: jest.Mock;
    count: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
  };
};

describe("BookingService", () => {
  let bookingService: BookingService;

  beforeEach(() => {
    bookingService = new BookingService();
    jest.clearAllMocks();

    prismaMock.user.findUnique.mockResolvedValue({ id: "user-1" });
    prismaMock.room.findUnique.mockResolvedValue({
      id: "room-1",
      status: "AVAILABLE",
      name: "Room A",
    });
    prismaMock.booking.findFirst.mockResolvedValue(null);
  });

  describe("getAllBookings()", () => {
    it("should return bookings with pagination", async () => {
      prismaMock.booking.count.mockResolvedValue(1);
      prismaMock.booking.findMany.mockResolvedValue([{ id: "booking-1" }]);

      const result = await bookingService.getAllBookings({
        limit: "10",
        offset: "0",
      });

      expect(prismaMock.booking.count).toHaveBeenCalled();
      expect(prismaMock.booking.findMany).toHaveBeenCalled();
      expect(result).toHaveProperty("bookings");
      expect(result).toHaveProperty("pagination");
    });
  });

  describe("getMyBookings()", () => {
    it("should return bookings of authenticated user", async () => {
      prismaMock.booking.findMany.mockResolvedValue([{ id: "booking-1" }]);

      const result = await bookingService.getMyBookings("user-1");

      expect(prismaMock.booking.findMany).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          room: true,
        },
      });
      expect(result).toEqual({
        bookings: [{ id: "booking-1" }],
      });
    });

    it("should throw BadRequestError when userId is missing", async () => {
      await expect(bookingService.getMyBookings("")).rejects.toThrow(
        BadRequestError,
      );
    });
  });

  describe("updateBooking()", () => {
    it("should update booking successfully", async () => {
      prismaMock.booking.findUnique.mockResolvedValueOnce({
        id: "booking-1",
        userId: "user-1",
        roomId: "room-1",
        startTime: new Date("2026-04-01T08:00:00.000Z"),
        endTime: new Date("2026-04-01T10:00:00.000Z"),
      });

      prismaMock.booking.update.mockResolvedValue({ id: "booking-1" });

      const result = await bookingService.updateBooking("booking-1", {
        purpose: "Updated",
      });

      expect(prismaMock.booking.update).toHaveBeenCalled();
      expect(result).toHaveProperty("booking");
    });

    it("should throw NotFoundError when booking to update not found", async () => {
      prismaMock.booking.findUnique.mockResolvedValueOnce(null);

      await expect(
        bookingService.updateBooking("booking-404", { purpose: "Updated" }),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("cancelBooking()", () => {
    it("should cancel booking successfully for owner", async () => {
      prismaMock.booking.findUnique.mockResolvedValue({
        id: "booking-1",
        userId: "user-1",
        status: "APPROVED",
      });
      prismaMock.booking.update.mockResolvedValue({
        id: "booking-1",
        userId: "user-1",
        status: "CANCELLED",
      });

      const result = await bookingService.cancelBooking(
        "booking-1",
        "user-1",
        "USER",
      );

      expect(prismaMock.booking.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "booking-1" },
          data: { status: "CANCELLED" },
        }),
      );
      expect(result).toHaveProperty("booking");
    });

    it("should throw NotFoundError when booking not found", async () => {
      prismaMock.booking.findUnique.mockResolvedValue(null);

      await expect(
        bookingService.cancelBooking("booking-404", "user-1", "USER"),
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw ForbiddenError when user is not owner", async () => {
      prismaMock.booking.findUnique.mockResolvedValue({
        id: "booking-1",
        userId: "owner-1",
        status: "APPROVED",
      });

      await expect(
        bookingService.cancelBooking("booking-1", "user-1", "USER"),
      ).rejects.toThrow(ForbiddenError);
    });

    it("should return current booking if already cancelled", async () => {
      prismaMock.booking.findUnique.mockResolvedValue({
        id: "booking-1",
        userId: "user-1",
        status: "CANCELLED",
      });

      const result = await bookingService.cancelBooking(
        "booking-1",
        "user-1",
        "USER",
      );

      expect(prismaMock.booking.update).not.toHaveBeenCalled();
      expect(result).toEqual({
        booking: {
          id: "booking-1",
          userId: "user-1",
          status: "CANCELLED",
        },
      });
    });

    it("should allow admin to cancel any booking", async () => {
      prismaMock.booking.findUnique.mockResolvedValue({
        id: "booking-1",
        userId: "owner-1",
        status: "APPROVED",
      });
      prismaMock.booking.update.mockResolvedValue({
        id: "booking-1",
        userId: "owner-1",
        status: "CANCELLED",
      });

      await bookingService.cancelBooking("booking-1", "admin-1", "ADMIN");

      expect(prismaMock.booking.update).toHaveBeenCalled();
    });

    it("should throw BadRequestError when completed booking is cancelled", async () => {
      prismaMock.booking.findUnique.mockResolvedValue({
        id: "booking-1",
        userId: "user-1",
        status: "COMPLETED",
      });

      await expect(
        bookingService.cancelBooking("booking-1", "user-1", "USER"),
      ).rejects.toThrow(BadRequestError);
    });
  });
});
