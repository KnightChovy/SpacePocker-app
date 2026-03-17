import BookingRequestService from "../bookingRequest.service";
import {
  BadRequestError,
  ConflictRequestError,
  ForbiddenError,
} from "../../core/error.response";
import MailQueueService from "../mailQueue.service";
import VnpayService from "../vnpay.service";

jest.mock("../../lib/prisma", () => ({
  prisma: {
    manager: {
      findFirst: jest.fn(),
    },
    bookingRequest: {
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

import { prisma } from "../../lib/prisma";

const prismaMock = prisma as unknown as {
  manager: {
    findFirst: jest.Mock;
  };
  bookingRequest: {
    findMany: jest.Mock;
  };
  $transaction: jest.Mock;
};

describe("BookingRequestService Manager Flow", () => {
  let service: BookingRequestService;

  beforeEach(() => {
    const bookingRequestRepo: any = {
      create: jest.fn(),
      findById: jest.fn(),
      findOverlappingPendingRequests: jest.fn(),
    };
    const roomRepo: any = {
      findById: jest.fn(),
    };
    const bookingRepo: any = {
      findOverlappingApprovedBookings: jest.fn(),
    };
    const mailQueueService: jest.Mocked<MailQueueService> = {
      publishBookingConfirmedEmailJob: jest.fn(),
    } as unknown as jest.Mocked<MailQueueService>;
    const vnpayService: jest.Mocked<VnpayService> = {
      createPaymentUrl: jest.fn(),
      verifyQuery: jest.fn(),
      extractBookingRequestId: jest.fn(),
    } as unknown as jest.Mocked<VnpayService>;

    service = new BookingRequestService(
      bookingRequestRepo,
      roomRepo,
      bookingRepo,
      mailQueueService,
      vnpayService,
    );
    jest.clearAllMocks();
  });

  describe("getBookingRequestsForManager()", () => {
    it("should throw BadRequestError if manager userId is missing", async () => {
      await expect(
        service.getBookingRequestsForManager(
          "",
          "manager@example.com",
          "PENDING",
        ),
      ).rejects.toThrow(BadRequestError);
    });

    it("should query booking requests by resolved manager and status", async () => {
      prismaMock.manager.findFirst.mockResolvedValue({
        id: "manager-profile-1",
      });
      prismaMock.bookingRequest.findMany.mockResolvedValue([{ id: "br-1" }]);

      const result = await service.getBookingRequestsForManager(
        "user-1",
        "manager@example.com",
        "PENDING",
      );

      expect(prismaMock.manager.findFirst).toHaveBeenCalled();
      expect(prismaMock.bookingRequest.findMany).toHaveBeenCalledWith({
        where: {
          status: "PENDING",
          room: {
            managerId: "manager-profile-1",
          },
        },
        orderBy: {
          createdAt: "asc",
        },
        include: {
          user: true,
          room: true,
        },
      });
      expect(result).toEqual([{ id: "br-1" }]);
    });
  });

  describe("getAllBookingRequestsForAdmin()", () => {
    it("should throw BadRequestError if admin userId is missing", async () => {
      await expect(service.getAllBookingRequestsForAdmin("")).rejects.toThrow(
        BadRequestError,
      );
    });

    it("should return all booking requests without status filter", async () => {
      prismaMock.bookingRequest.findMany.mockResolvedValue([{ id: "br-1" }]);

      const result = await service.getAllBookingRequestsForAdmin("admin-1");

      expect(prismaMock.bookingRequest.findMany).toHaveBeenCalledWith({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
          room: {
            include: {
              building: true,
            },
          },
        },
      });
      expect(result).toEqual([{ id: "br-1" }]);
    });
  });

  describe("approveBookingRequest()", () => {
    const managerId = "manager-1";
    const requestId = "br-1";
    const bookingRequest = {
      id: requestId,
      roomId: "room-1",
      userId: "user-1",
      startTime: new Date("2026-03-20T09:00:00.000Z"),
      endTime: new Date("2026-03-20T11:00:00.000Z"),
      purpose: "Sprint planning",
      status: "PENDING",
      createdAt: new Date("2026-03-10T10:00:00.000Z"),
    };

    const approvedRequest = {
      ...bookingRequest,
      status: "APPROVED",
      approvedBy: managerId,
    };

    const tx: any = {
      bookingRequest: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        updateMany: jest.fn(),
      },
      room: {
        findUnique: jest.fn(),
      },
      booking: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
      $executeRaw: jest.fn(),
    };

    beforeEach(() => {
      prismaMock.manager.findFirst.mockResolvedValue({ id: managerId });
      prismaMock.$transaction.mockImplementation(async (callback: any) => {
        return callback(tx);
      });

      tx.bookingRequest.findUnique
        .mockResolvedValueOnce(bookingRequest)
        .mockResolvedValueOnce(approvedRequest);
      tx.room.findUnique.mockResolvedValue({
        id: "room-1",
        name: "Room A",
        status: "AVAILABLE",
        managerId,
      });
      tx.$executeRaw.mockResolvedValue(1);
      tx.bookingRequest.findFirst.mockResolvedValue(null);
      tx.booking.findFirst.mockResolvedValue(null);
      tx.bookingRequest.updateMany.mockResolvedValue({ count: 1 });
    });

    it("should approve and create booking successfully", async () => {
      const result = await service.approveBookingRequest(
        requestId,
        "user-1",
        "manager@example.com",
      );

      expect(tx.$executeRaw).toHaveBeenCalled();
      expect(tx.bookingRequest.updateMany).toHaveBeenCalledWith({
        where: {
          id: requestId,
          status: "PENDING",
        },
        data: {
          status: "APPROVED",
          approvedBy: managerId,
        },
      });
      expect(result).toEqual({
        bookingRequest: approvedRequest,
        booking: null,
      });
    });

    it("should reject approval when older pending request exists", async () => {
      tx.bookingRequest.findFirst.mockResolvedValueOnce({ id: "older-br" });

      await expect(
        service.approveBookingRequest(
          requestId,
          "user-1",
          "manager@example.com",
        ),
      ).rejects.toThrow(ConflictRequestError);
    });

    it("should reject approval from different manager", async () => {
      tx.room.findUnique.mockResolvedValueOnce({
        id: "room-1",
        name: "Room A",
        status: "AVAILABLE",
        managerId: "manager-2",
      });

      await expect(
        service.approveBookingRequest(
          requestId,
          "user-1",
          "manager@example.com",
        ),
      ).rejects.toThrow(ForbiddenError);
    });
  });

  describe("rejectBookingRequest()", () => {
    const tx: any = {
      bookingRequest: {
        findUnique: jest.fn(),
        updateMany: jest.fn(),
      },
      room: {
        findUnique: jest.fn(),
      },
    };

    beforeEach(() => {
      prismaMock.manager.findFirst.mockResolvedValue({ id: "manager-1" });
      prismaMock.$transaction.mockImplementation(async (callback: any) => {
        return callback(tx);
      });
    });

    it("should reject pending request successfully", async () => {
      tx.bookingRequest.findUnique
        .mockResolvedValueOnce({
          id: "br-1",
          roomId: "room-1",
          status: "PENDING",
        })
        .mockResolvedValueOnce({
          id: "br-1",
          roomId: "room-1",
          status: "REJECTED",
          approvedBy: "manager-1",
        });
      tx.room.findUnique.mockResolvedValue({ managerId: "manager-1" });
      tx.bookingRequest.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.rejectBookingRequest(
        "br-1",
        "user-1",
        "manager@example.com",
      );

      expect(result).toEqual({
        id: "br-1",
        roomId: "room-1",
        status: "REJECTED",
        approvedBy: "manager-1",
      });
    });

    it("should throw conflict when request already processed", async () => {
      tx.bookingRequest.findUnique.mockResolvedValueOnce({
        id: "br-1",
        roomId: "room-1",
        status: "PENDING",
      });
      tx.room.findUnique.mockResolvedValue({ managerId: "manager-1" });
      tx.bookingRequest.updateMany.mockResolvedValue({ count: 0 });

      await expect(
        service.rejectBookingRequest("br-1", "user-1", "manager@example.com"),
      ).rejects.toThrow(ConflictRequestError);
    });
  });
});
