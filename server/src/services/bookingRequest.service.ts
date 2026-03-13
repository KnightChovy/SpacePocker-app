import { IBookingRequestRepository } from "../interface/bookingRequest.repository.interface";
import {
  BadRequestError,
  NotFoundError,
  ConflictRequestError,
  ForbiddenError,
} from "../core/error.response";
import { IRoomRepository } from "../interface/room.repository.interface";
import { IBookingRepository } from "../interface/booking.repository.interface";
import { BookingStatus, Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export default class BookingRequestService {
  constructor(
    private bookingRequestRepo: IBookingRequestRepository,
    private roomRepo: IRoomRepository,
    private bookingRepo: IBookingRepository,
  ) {}

  private async resolveManagerId(userId: string, userEmail?: string) {
    const manager = await prisma.manager.findFirst({
      where: {
        OR: [{ id: userId }, ...(userEmail ? [{ email: userEmail }] : [])],
      },
      select: {
        id: true,
      },
    });

    if (!manager) {
      throw new NotFoundError("Manager profile not found");
    }

    return manager.id;
  }

  async createBookingRequest(data: {
    userId: string;
    roomId: string;
    startTime: string;
    endTime: string;
    purpose?: string;
  }) {
    const {
      userId,
      roomId,
      startTime: startTimeStr,
      endTime: endTimeStr,
      purpose,
    } = data;

    if (!userId) {
      throw new BadRequestError("User ID is required");
    }
    if (!roomId || typeof roomId !== "string" || roomId.trim() === "") {
      throw new BadRequestError("roomId is required");
    }
    if (!startTimeStr) {
      throw new BadRequestError("startTime is required");
    }
    if (!endTimeStr) {
      throw new BadRequestError("endTime is required");
    }

    const startTime = new Date(startTimeStr);
    const endTime = new Date(endTimeStr);

    if (isNaN(startTime.getTime())) {
      throw new BadRequestError(
        "startTime must be a valid ISO 8601 date string",
      );
    }
    if (isNaN(endTime.getTime())) {
      throw new BadRequestError("endTime must be a valid ISO 8601 date string");
    }
    if (startTime >= endTime) {
      throw new BadRequestError("endTime must be greater than startTime");
    }
    if (startTime < new Date()) {
      throw new BadRequestError("Cannot book a room in the past");
    }

    const room = await this.roomRepo.findById(roomId);
    if (!room) {
      throw new NotFoundError(`Room with id not found`);
    }
    if (room.status !== "AVAILABLE") {
      throw new BadRequestError(
        `Room '${room.name}' is currently not available for booking`,
      );
    }

    const overlappingBookings =
      await this.bookingRepo.findOverlappingApprovedBookings({
        roomId,
        startTime,
        endTime,
      });

    if (overlappingBookings.length > 0) {
      const conflict = overlappingBookings[0];
      throw new ConflictRequestError(
        `Room is already booked from ${conflict.startTime.toISOString()} to ${conflict.endTime.toISOString()}`,
      );
    }

    const overlappingPendingRequests =
      await this.bookingRequestRepo.findOverlappingPendingRequests({
        roomId,
        userId,
        startTime,
        endTime,
      });

    if (overlappingPendingRequests.length > 0) {
      throw new ConflictRequestError(
        "You already have a pending booking request for this room during the selected time slot",
      );
    }

    const bookingRequest = await this.bookingRequestRepo.create({
      userId,
      roomId,
      startTime,
      endTime,
      purpose,
    });

    return bookingRequest;
  }

  async getBookingRequestById(id: string) {
    const bookingRequest = await this.bookingRequestRepo.findById(id);
    if (!bookingRequest) {
      throw new NotFoundError(`Booking request with id not found`);
    }
    return bookingRequest;
  }

  async getBookingRequestsForManager(
    userId: string,
    userEmail?: string,
    status: BookingStatus = "PENDING",
  ) {
    if (!userId) {
      throw new BadRequestError("Manager ID is required");
    }

    const managerId = await this.resolveManagerId(userId, userEmail);

    return prisma.bookingRequest.findMany({
      where: {
        status,
        room: {
          managerId,
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
  }

  async approveBookingRequest(id: string, userId: string, userEmail?: string) {
    if (!userId) {
      throw new BadRequestError("Manager ID is required");
    }

    const managerId = await this.resolveManagerId(userId, userEmail);

    return prisma.$transaction(
      async (tx) => {
        const bookingRequest = await tx.bookingRequest.findUnique({
          where: { id },
        });

        if (!bookingRequest) {
          throw new NotFoundError("Booking request with id not found");
        }

        const room = await tx.room.findUnique({
          where: {
            id: bookingRequest.roomId,
          },
          select: {
            id: true,
            name: true,
            status: true,
            managerId: true,
          },
        });

        if (!room) {
          throw new NotFoundError("Room with id not found");
        }
        if (room.managerId !== managerId) {
          throw new ForbiddenError(
            "You are not allowed to approve this request",
          );
        }
        if (bookingRequest.status !== "PENDING") {
          throw new ConflictRequestError(
            "Booking request has already been processed",
          );
        }
        if (room.status !== "AVAILABLE") {
          throw new BadRequestError(
            `Room '${room.name}' is currently not available for booking`,
          );
        }

        // Serialize approvals per room to prevent concurrent double booking.
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${bookingRequest.roomId}))`;

        const olderPendingRequest = await tx.bookingRequest.findFirst({
          where: {
            roomId: bookingRequest.roomId,
            status: "PENDING",
            createdAt: {
              lt: bookingRequest.createdAt,
            },
            AND: [
              { startTime: { lt: bookingRequest.endTime } },
              { endTime: { gt: bookingRequest.startTime } },
            ],
          },
          orderBy: {
            createdAt: "asc",
          },
        });

        if (olderPendingRequest) {
          throw new ConflictRequestError(
            "An earlier pending request has priority for this time slot",
          );
        }

        const overlappingBooking = await tx.booking.findFirst({
          where: {
            roomId: bookingRequest.roomId,
            status: {
              in: ["APPROVED", "COMPLETED"],
            },
            AND: [
              { startTime: { lt: bookingRequest.endTime } },
              { endTime: { gt: bookingRequest.startTime } },
            ],
          },
        });

        if (overlappingBooking) {
          throw new ConflictRequestError(
            `Room is already booked from ${overlappingBooking.startTime.toISOString()} to ${overlappingBooking.endTime.toISOString()}`,
          );
        }

        const updated = await tx.bookingRequest.updateMany({
          where: {
            id,
            status: "PENDING",
          },
          data: {
            status: "APPROVED",
            approvedBy: managerId,
          },
        });

        if (updated.count === 0) {
          throw new ConflictRequestError(
            "Booking request has already been processed",
          );
        }

        const booking = await tx.booking.create({
          data: {
            userId: bookingRequest.userId,
            roomId: bookingRequest.roomId,
            startTime: bookingRequest.startTime,
            endTime: bookingRequest.endTime,
            purpose: bookingRequest.purpose,
            status: "APPROVED",
          },
        });

        const approvedRequest = await tx.bookingRequest.findUnique({
          where: { id },
        });

        return {
          bookingRequest: approvedRequest,
          booking,
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }

  async rejectBookingRequest(id: string, userId: string, userEmail?: string) {
    if (!userId) {
      throw new BadRequestError("Manager ID is required");
    }

    const managerId = await this.resolveManagerId(userId, userEmail);

    return prisma.$transaction(
      async (tx) => {
        const bookingRequest = await tx.bookingRequest.findUnique({
          where: { id },
        });

        if (!bookingRequest) {
          throw new NotFoundError("Booking request with id not found");
        }

        const room = await tx.room.findUnique({
          where: {
            id: bookingRequest.roomId,
          },
          select: {
            managerId: true,
          },
        });

        if (!room) {
          throw new NotFoundError("Room with id not found");
        }
        if (room.managerId !== managerId) {
          throw new ForbiddenError(
            "You are not allowed to reject this request",
          );
        }

        const updated = await tx.bookingRequest.updateMany({
          where: {
            id,
            status: "PENDING",
          },
          data: {
            status: "REJECTED",
            approvedBy: managerId,
          },
        });

        if (updated.count === 0) {
          throw new ConflictRequestError(
            "Booking request has already been processed",
          );
        }

        const rejectedRequest = await tx.bookingRequest.findUnique({
          where: { id },
        });

        if (!rejectedRequest) {
          throw new NotFoundError("Booking request with id not found");
        }

        return rejectedRequest;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }
}
