import BookingService from "../booking.service";
import {
  BadRequestError,
  ConflictRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../core/error.response";
import MailQueueService from "../mailQueue.service";

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
    bookingRequest: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
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
  bookingRequest: {
    findUnique: jest.Mock;
    update: jest.Mock;
  };
  $transaction: jest.Mock;
};

describe("BookingService", () => {
  let bookingService: BookingService;
  let mailQueueServiceMock: jest.Mocked<MailQueueService>;

  beforeEach(() => {
    mailQueueServiceMock = {
      publishBookingConfirmedEmailJob: jest.fn(),
      publishBookingRefundSuccessEmailJob: jest.fn(),
    } as unknown as jest.Mocked<MailQueueService>;
    bookingService = new BookingService(mailQueueServiceMock);
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

  describe("managerCancelPaidBookingAndNotifyRefund()", () => {
    it("should cancel completed booking by bookingRequestId and queue refund email", async () => {
      const startTime = new Date("2026-05-01T08:00:00.000Z");
      const endTime = new Date("2026-05-01T10:00:00.000Z");

      prismaMock.bookingRequest.findUnique.mockResolvedValue({
        id: "br-1",
        userId: "user-1",
        roomId: "room-1",
        startTime,
        endTime,
        status: "COMPLETED",
        user: {
          id: "user-1",
          name: "User One",
          email: "user1@example.com",
        },
        room: {
          id: "room-1",
          name: "Room A",
          managerId: "manager-1",
          pricePerHour: 50000,
        },
      });

      prismaMock.booking.findFirst.mockResolvedValue({
        id: "booking-1",
        userId: "user-1",
        roomId: "room-1",
        startTime,
        endTime,
        status: "COMPLETED",
        user: {
          id: "user-1",
          name: "User One",
          email: "user1@example.com",
        },
        room: {
          id: "room-1",
          name: "Room A",
          pricePerHour: 50000,
        },
      });

      prismaMock.$transaction.mockImplementation(async (callback: any) =>
        callback({
          bookingRequest: {
            update: jest.fn().mockResolvedValue({
              id: "br-1",
              status: "CANCELLED",
            }),
          },
          booking: {
            update: jest.fn().mockResolvedValue({
              id: "booking-1",
              userId: "user-1",
              roomId: "room-1",
              startTime,
              endTime,
              status: "CANCELLED",
              user: {
                id: "user-1",
                name: "User One",
                email: "user1@example.com",
              },
              room: {
                id: "room-1",
                name: "Room A",
                pricePerHour: 50000,
              },
            }),
          },
        }),
      );

      const result = await bookingService.managerCancelPaidBookingAndNotifyRefund(
        "br-1",
        "manager-1",
        "MANAGER",
        "Room issue",
      );

      expect(result.bookingRequest.status).toBe("CANCELLED");
      expect(result.booking).not.toBeNull();
      expect(result.booking?.status).toBe("CANCELLED");
      expect(result.refund).toEqual({
        amount: 100000,
        reason: "Room issue",
        status: "SUCCESS",
      });
      expect(
        mailQueueServiceMock.publishBookingRefundSuccessEmailJob,
      ).toHaveBeenCalledWith({
        to: "user1@example.com",
        customerName: "User One",
        bookingId: "booking-1",
        roomName: "Room A",
        refundAmount: 100000,
        refundReason: "Room issue",
      });
    });

    it("should throw ForbiddenError when role is not MANAGER or ADMIN", async () => {
      prismaMock.bookingRequest.findUnique.mockResolvedValue({
        id: "br-1",
        userId: "user-1",
        roomId: "room-1",
        startTime: new Date("2026-05-01T08:00:00.000Z"),
        endTime: new Date("2026-05-01T10:00:00.000Z"),
        status: "COMPLETED",
        user: {
          id: "user-1",
          name: "User One",
          email: "user1@example.com",
        },
        room: {
          id: "room-1",
          name: "Room A",
          managerId: "manager-2",
          pricePerHour: 50000,
        },
      });

      await expect(
        bookingService.managerCancelPaidBookingAndNotifyRefund(
          "br-1",
          "user-1",
          "USER",
        ),
      ).rejects.toThrow(ForbiddenError);
    });

    it("should return NOT_APPLICABLE refund status when cancelled booking was not completed", async () => {
      const startTime = new Date("2026-05-01T08:00:00.000Z");
      const endTime = new Date("2026-05-01T10:00:00.000Z");

      prismaMock.bookingRequest.findUnique.mockResolvedValue({
        id: "br-1",
        userId: "user-1",
        roomId: "room-1",
        startTime,
        endTime,
        status: "APPROVED",
        user: {
          id: "user-1",
          name: "User One",
          email: "user1@example.com",
        },
        room: {
          id: "room-1",
          name: "Room A",
          managerId: "manager-1",
          pricePerHour: 50000,
        },
      });

      prismaMock.booking.findFirst.mockResolvedValue({
        id: "booking-1",
        userId: "user-1",
        roomId: "room-1",
        startTime,
        endTime,
        status: "APPROVED",
        user: {
          id: "user-1",
          name: "User One",
          email: "user1@example.com",
        },
        room: {
          id: "room-1",
          name: "Room A",
          pricePerHour: 50000,
        },
      });

      prismaMock.$transaction.mockImplementation(async (callback: any) =>
        callback({
          bookingRequest: {
            update: jest.fn().mockResolvedValue({
              id: "br-1",
              status: "CANCELLED",
            }),
          },
          booking: {
            update: jest.fn().mockResolvedValue({
              id: "booking-1",
              userId: "user-1",
              roomId: "room-1",
              startTime,
              endTime,
              status: "CANCELLED",
              user: {
                id: "user-1",
                name: "User One",
                email: "user1@example.com",
              },
              room: {
                id: "room-1",
                name: "Room A",
                pricePerHour: 50000,
              },
            }),
          },
        }),
      );

      const result = await bookingService.managerCancelPaidBookingAndNotifyRefund(
        "br-1",
        "manager-1",
        "MANAGER",
      );

      expect(result.refund).toEqual({
        amount: 0,
        reason: null,
        status: "NOT_APPLICABLE",
      });
      expect(
        mailQueueServiceMock.publishBookingRefundSuccessEmailJob,
      ).not.toHaveBeenCalled();
    });

    it("should throw ConflictRequestError when both booking and booking request are already cancelled", async () => {
      prismaMock.bookingRequest.findUnique.mockResolvedValue({
        id: "br-1",
        userId: "user-1",
        roomId: "room-1",
        startTime: new Date("2026-05-01T08:00:00.000Z"),
        endTime: new Date("2026-05-01T10:00:00.000Z"),
        status: "CANCELLED",
        user: {
          id: "user-1",
          name: "User One",
          email: "user1@example.com",
        },
        room: {
          id: "room-1",
          name: "Room A",
          managerId: "manager-1",
          pricePerHour: 50000,
        },
      });
      prismaMock.booking.findFirst.mockResolvedValue({
        id: "booking-1",
        status: "CANCELLED",
      });

      await expect(
        bookingService.managerCancelPaidBookingAndNotifyRefund(
          "br-1",
          "manager-1",
          "MANAGER",
        ),
      ).rejects.toThrow(ConflictRequestError);
    });
  });
});
