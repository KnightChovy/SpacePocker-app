import { IBookingRequestRepository } from "../interface/bookingRequest.repository.interface";
import {
  BadRequestError,
  NotFoundError,
  ConflictRequestError,
  ForbiddenError,
} from "../core/error.response";
import { IRoomRepository } from "../interface/room.repository.interface";
import { IBookingRepository } from "../interface/booking.repository.interface";
import { ITransactionRepository } from "../interface/transaction.repository.interface";
import { BookingStatus, PaymentMethod, Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import MailQueueService from "./mailQueue.service";
import VnpayService from "./vnpay.service";

export default class BookingRequestService {
  constructor(
    private bookingRequestRepo: IBookingRequestRepository,
    private roomRepo: IRoomRepository,
    private bookingRepo: IBookingRepository,
    private mailQueueService: MailQueueService,
    private vnpayService: VnpayService,
    private transactionRepo: ITransactionRepository,
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
    amenityIds?: string[];
    services?: Array<{ serviceId: string; quantity: number }>;
    paymentMethod?: PaymentMethod;
    totalAmount?: number;
  }) {
    const {
      userId,
      roomId,
      startTime: startTimeStr,
      endTime: endTimeStr,
      purpose,
      amenityIds,
      services,
      paymentMethod = "VNPAY",
      totalAmount: feTotalAmount,
    } = data;
    const uniqueAmenityIds = Array.from(new Set(amenityIds ?? []));

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

    // Validate amenityIds
    if (uniqueAmenityIds.length > 0) {
      const roomAmenities = await prisma.roomAmenity.findMany({
        where: {
          roomId,
          amenityId: { in: uniqueAmenityIds },
        },
      });

      if (roomAmenities.length !== uniqueAmenityIds.length) {
        throw new BadRequestError(
          "One or more selected amenities are not available for this room",
        );
      }
    }

    // Validate services
    if (services && services.length > 0) {
      const serviceIds = services.map((s) => s.serviceId);

      // Get all service categories available for this room
      const roomServiceCategories = await prisma.roomServiceCategory.findMany({
        where: { roomId },
        include: {
          category: {
            include: { services: true },
          },
        },
      });

      // Get all available service IDs for this room
      const availableServiceIds = roomServiceCategories.flatMap((rsc) =>
        rsc.category.services.map((s) => s.id),
      );

      // Check if all selected services are available
      const invalidServices = serviceIds.filter(
        (id) => !availableServiceIds.includes(id),
      );

      if (invalidServices.length > 0) {
        throw new BadRequestError(
          `The following services are not available for this room: ${invalidServices.join(", ")}`,
        );
      }

      // Validate quantity
      const invalidQuantity = services.find((s) => s.quantity < 1);
      if (invalidQuantity) {
        throw new BadRequestError("Service quantity must be at least 1");
      }
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

    // Calculate total amount
    const hoursDiff =
      (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    let totalAmount = room.pricePerHour * hoursDiff;
    let servicesData: Array<{ id: string; name: string; price: number }> = [];

    // Add service costs
    if (services && services.length > 0) {
      servicesData = await prisma.service.findMany({
        where: { id: { in: services.map((s) => s.serviceId) } },
        select: {
          id: true,
          name: true,
          price: true,
        },
      });

      const serviceCost = services.reduce((sum, selectedService) => {
        const service = servicesData.find(
          (s) => s.id === selectedService.serviceId,
        );
        return sum + (service ? service.price * selectedService.quantity : 0);
      }, 0);

      totalAmount += serviceCost;
    }

    const allowedMethods: PaymentMethod[] = ["VNPAY", "CASH", "BANK_TRANSFER"];
    if (!allowedMethods.includes(paymentMethod)) {
      throw new BadRequestError(
        `Invalid payment method. Allowed: ${allowedMethods.join(", ")}`,
      );
    }

    const bookingRequest = await prisma.bookingRequest.create({
      data: {
        userId,
        roomId,
        startTime,
        endTime,
        purpose,
        paymentMethod,
        totalAmount: feTotalAmount !== undefined ? feTotalAmount : totalAmount,
        ...(servicesData.length > 0 && {
          services: {
            create: services!.map((sel) => {
              const svc = servicesData.find((s) => s.id === sel.serviceId)!;
              return {
                serviceId: svc.id,
                quantity: sel.quantity,
                priceSnapshot: svc.price,
              };
            }),
          },
        }),
      },
    });

    const selectedAmenities =
      uniqueAmenityIds.length > 0
        ? await prisma.amenity.findMany({
            where: { id: { in: uniqueAmenityIds } },
            select: { id: true, name: true },
          })
        : [];

    const selectedServices =
      servicesData.length > 0
        ? services!
            .map((sel) => {
              const svc = servicesData.find((s) => s.id === sel.serviceId);
              if (!svc) return null;
              return {
                serviceId: svc.id,
                name: svc.name,
                price: svc.price,
                quantity: sel.quantity,
                lineTotal: svc.price * sel.quantity,
              };
            })
            .filter((item): item is NonNullable<typeof item> => item !== null)
        : [];

    return {
      ...bookingRequest,
      amenities: selectedAmenities,
      services: selectedServices,
      totalCost: totalAmount,
    };
  }

  async createBookingRequestAndPaymentUrlForMobile(data: {
    userId: string;
    roomId: string;
    startTime: string;
    endTime: string;
    purpose?: string;
    amenityIds?: string[];
    services?: Array<{ serviceId: string; quantity: number }>;
    totalAmount?: number;
    ipAddr: string;
    locale?: "vn" | "en";
  }) {
    const bookingRequest = await this.createBookingRequest({
      userId: data.userId,
      roomId: data.roomId,
      startTime: data.startTime,
      endTime: data.endTime,
      purpose: data.purpose,
      amenityIds: data.amenityIds,
      services: data.services,
      totalAmount: data.totalAmount,
    });

    const room = await this.roomRepo.findById(data.roomId);
    if (!room) {
      throw new NotFoundError("Room with id not found");
    }

    await prisma.bookingRequest.update({
      where: { id: bookingRequest.id },
      data: {
        status: "APPROVED",
        approvedBy: room.managerId,
      },
    });

    const paymentPayload = await this.createPaymentUrlForApprovedBookingRequest(
      {
        bookingRequestId: bookingRequest.id,
        userId: data.userId,
        ipAddr: data.ipAddr,
        locale: data.locale,
      },
    );

    return {
      ...paymentPayload,
      status: "APPROVED",
    };
  }

  async getBookingRequestById(id: string) {
    const bookingRequest = await this.bookingRequestRepo.findById(id);
    if (!bookingRequest) {
      throw new NotFoundError(`Booking request with id not found`);
    }
    return bookingRequest;
  }

  async getMyBookingRequests(userId: string, status?: BookingStatus) {
    if (!userId) {
      throw new BadRequestError("User ID is required");
    }

    const where: Prisma.BookingRequestWhereInput = {
      userId,
      ...(status && { status }),
    };

    const bookingRequests = await prisma.bookingRequest.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        room: {
          include: {
            building: true,
          },
        },
      },
    });

    if (bookingRequests.length === 0) {
      return bookingRequests;
    }

    const roomIds = Array.from(
      new Set(bookingRequests.map((item) => item.roomId)),
    );
    const feedbacks = await prisma.feedback.findMany({
      where: {
        userId,
        roomId: {
          in: roomIds,
        },
      },
      select: {
        roomId: true,
      },
    });

    const feedbackRoomIds = new Set(feedbacks.map((item) => item.roomId));

    return bookingRequests.map((item) => ({
      ...item,
      hasFeedback: feedbackRoomIds.has(item.roomId),
    }));
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

  async getAllBookingRequestsForAdmin(userId: string) {
    if (!userId) {
      throw new BadRequestError("Admin ID is required");
    }

    return prisma.bookingRequest.findMany({
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

        const approvedRequest = await tx.bookingRequest.findUnique({
          where: { id },
        });

        return {
          bookingRequest: approvedRequest,
          booking: null,
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

  async cancelMyBookingRequest(id: string, userId: string) {
    if (!userId) {
      throw new BadRequestError("User ID is required");
    }

    const bookingRequest = await prisma.bookingRequest.findUnique({
      where: { id },
    });

    if (!bookingRequest) {
      throw new NotFoundError("Booking request with id not found");
    }

    if (bookingRequest.userId !== userId) {
      throw new ForbiddenError(
        "You are not allowed to cancel this booking request",
      );
    }

    if (bookingRequest.status === "COMPLETED") {
      throw new ConflictRequestError(
        "Cannot cancel a completed booking request",
      );
    }

    if (bookingRequest.status === "CANCELLED") {
      return bookingRequest;
    }

    const updated = await prisma.bookingRequest.updateMany({
      where: {
        id,
        userId,
        status: {
          notIn: ["COMPLETED", "CANCELLED"],
        },
      },
      data: {
        status: "CANCELLED",
      },
    });

    if (updated.count === 0) {
      const latest = await prisma.bookingRequest.findUnique({
        where: { id },
      });

      if (!latest) {
        throw new NotFoundError("Booking request with id not found");
      }

      if (latest.status === "COMPLETED") {
        throw new ConflictRequestError(
          "Cannot cancel a completed booking request",
        );
      }

      if (latest.status === "CANCELLED") {
        return latest;
      }

      throw new ConflictRequestError(
        "Booking request has already been processed",
      );
    }

    const cancelled = await prisma.bookingRequest.findUnique({
      where: { id },
    });

    if (!cancelled) {
      throw new NotFoundError("Booking request with id not found");
    }

    return cancelled;
  }

  private calculateRoomAmount(
    roomPricePerHour: number,
    startTime: Date,
    endTime: Date,
  ) {
    const diffMs = endTime.getTime() - startTime.getTime();

    if (diffMs <= 0) {
      throw new Error("End time must be after start time");
    }

    const hours = diffMs / (1000 * 60 * 60);

    const roundedHours = Math.ceil(hours); // làm tròn lên

    return roomPricePerHour * roundedHours;
  }

  async createPaymentUrlForApprovedBookingRequest(input: {
    bookingRequestId: string;
    userId: string;
    ipAddr: string;
    locale?: "vn" | "en";
  }) {
    const bookingRequest = await prisma.bookingRequest.findUnique({
      where: { id: input.bookingRequestId },
      include: {
        room: {
          select: {
            pricePerHour: true,
            name: true,
          },
        },
      },
    });

    if (!bookingRequest) {
      throw new NotFoundError("Booking request with id not found");
    }
    if (bookingRequest.userId !== input.userId) {
      throw new ForbiddenError(
        "You are not allowed to pay this booking request",
      );
    }
    if (bookingRequest.status !== "APPROVED") {
      throw new BadRequestError(
        "Booking request must be approved before payment",
      );
    }

    const existedBooking = await prisma.booking.findFirst({
      where: {
        userId: bookingRequest.userId,
        roomId: bookingRequest.roomId,
        startTime: bookingRequest.startTime,
        endTime: bookingRequest.endTime,
      },
      select: { id: true },
    });

    if (existedBooking) {
      throw new ConflictRequestError("Booking request has already been paid");
    }

    const amount =
      bookingRequest.totalAmount ??
      this.calculateRoomAmount(
        bookingRequest.room.pricePerHour,
        bookingRequest.startTime,
        bookingRequest.endTime,
      );

    const { paymentUrl, txnRef } = this.vnpayService.createPaymentUrl({
      bookingRequestId: bookingRequest.id,
      amount,
      ipAddr: input.ipAddr,
      locale: input.locale,
      orderInfo: `Thanh toan booking ${bookingRequest.id}`,
    });

    return {
      paymentUrl,
      txnRef,
      amount,
      bookingRequestId: bookingRequest.id,
      roomName: bookingRequest.room.name,
    };
  }

  private async createBookingFromPayment(
    tx: Prisma.TransactionClient,
    bookingRequestId: string,
  ) {
    const bookingRequest = await tx.bookingRequest.findUnique({
      where: { id: bookingRequestId },
      select: {
        id: true,
        userId: true,
        roomId: true,
        startTime: true,
        endTime: true,
        purpose: true,
        status: true,
        totalAmount: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        room: {
          select: {
            id: true,
            name: true,
            pricePerHour: true,
          },
        },
      },
    });

    if (!bookingRequest) {
      throw new NotFoundError("Booking request with id not found");
    }

    const existingBooking = await tx.booking.findFirst({
      where: {
        userId: bookingRequest.userId,
        roomId: bookingRequest.roomId,
        startTime: bookingRequest.startTime,
        endTime: bookingRequest.endTime,
      },
    });

    if (existingBooking) {
      if (bookingRequest.status !== "COMPLETED") {
        await tx.bookingRequest.update({
          where: { id: bookingRequest.id },
          data: { status: "COMPLETED" },
        });
      }

      const completedBooking =
        existingBooking.status === "COMPLETED"
          ? existingBooking
          : await tx.booking.update({
              where: { id: existingBooking.id },
              data: { status: "COMPLETED" },
            });

      return {
        booking: completedBooking,
        bookingRequest,
        created: false,
      };
    }

    if (bookingRequest.status !== "APPROVED") {
      throw new ConflictRequestError(
        "Booking request is not eligible for payment confirmation",
      );
    }

    const booking = await tx.booking.create({
      data: {
        userId: bookingRequest.userId,
        roomId: bookingRequest.roomId,
        startTime: bookingRequest.startTime,
        endTime: bookingRequest.endTime,
        purpose: bookingRequest.purpose,
        status: "COMPLETED",
      },
    });

    await tx.bookingRequest.update({
      where: { id: bookingRequest.id },
      data: { status: "COMPLETED" },
    });

    return {
      booking,
      bookingRequest,
      created: true,
    };
  }

  async processVnpayPayment(rawQuery: Record<string, string>) {
    const isChecksumValid = this.vnpayService.verifyQuery(rawQuery);
    if (!isChecksumValid) {
      return {
        success: false,
        code: "97",
        message: "Invalid checksum",
      };
    }

    const txnRef = rawQuery.vnp_TxnRef || "";
    const responseCode = rawQuery.vnp_ResponseCode || "";
    const transactionStatus = rawQuery.vnp_TransactionStatus || "";
    const bookingRequestId = this.vnpayService.extractBookingRequestId(txnRef);
    const vnpAmount = rawQuery.vnp_Amount
      ? Number(rawQuery.vnp_Amount) / 100
      : 0;

    if (responseCode !== "00" || transactionStatus !== "00") {
      // Record failed transaction if we can identify the booking request
      if (bookingRequestId) {
        const br = await prisma.bookingRequest.findUnique({
          where: { id: bookingRequestId },
          select: {
            userId: true,
            totalAmount: true,
            room: { select: { pricePerHour: true } },
            startTime: true,
            endTime: true,
          },
        });
        if (br) {
          const amount =
            vnpAmount ||
            br.totalAmount ||
            this.calculateRoomAmount(
              br.room.pricePerHour,
              br.startTime,
              br.endTime,
            );
          await this.transactionRepo.create({
            bookingRequestId,
            userId: br.userId,
            amount,
            paymentMethod: "VNPAY",
            status: "FAILED",
            txnRef,
            note: `VNPAY response code: ${responseCode}`,
          });
        }
      }
      return {
        success: false,
        code: responseCode || transactionStatus || "99",
        message: "Payment failed",
        bookingRequestId,
      };
    }

    let result:
      | {
          booking: {
            id: string;
            startTime: Date;
            endTime: Date;
          };
          bookingRequest: {
            userId: string;
            user: { email: string; name: string };
            room: { name: string; pricePerHour: number };
            totalAmount: number | null;
          };
          created: boolean;
        }
      | undefined;

    try {
      result = await prisma.$transaction(
        async (tx) => this.createBookingFromPayment(tx, bookingRequestId),
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      );
    } catch (error) {
      return {
        success: false,
        code: "99",
        message: (error as Error)?.message || "Payment processing failed",
        bookingRequestId,
      };
    }

    if (result.created) {
      const amount =
        vnpAmount ||
        result.bookingRequest.totalAmount ||
        this.calculateRoomAmount(
          result.bookingRequest.room.pricePerHour,
          result.booking.startTime,
          result.booking.endTime,
        );

      await this.transactionRepo.create({
        bookingId: result.booking.id,
        bookingRequestId,
        userId: result.bookingRequest.userId,
        amount,
        paymentMethod: "VNPAY",
        status: "SUCCESS",
        txnRef,
        paidAt: new Date(),
      });

      await this.mailQueueService.publishBookingConfirmedEmailJob({
        to: result.bookingRequest.user.email,
        customerName: result.bookingRequest.user.name,
        bookingId: result.booking.id,
        roomName: result.bookingRequest.room.name,
        startTime: result.booking.startTime.toISOString(),
        endTime: result.booking.endTime.toISOString(),
      });
    }

    return {
      success: true,
      code: "00",
      message: "Payment confirmed",
      bookingRequestId,
      bookingId: result.booking.id,
      alreadyProcessed: !result.created,
    };
  }

  async confirmOfflinePayment(input: {
    bookingRequestId: string;
    managerId: string;
    managerEmail?: string;
    note?: string;
  }) {
    const { bookingRequestId, managerId, managerEmail, note } = input;

    const resolvedManagerId = await this.resolveManagerId(
      managerId,
      managerEmail,
    );

    const bookingRequest = await prisma.bookingRequest.findUnique({
      where: { id: bookingRequestId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        room: {
          select: { id: true, name: true, pricePerHour: true, managerId: true },
        },
      },
    });

    if (!bookingRequest) {
      throw new NotFoundError("Booking request not found");
    }
    if (bookingRequest.room.managerId !== resolvedManagerId) {
      throw new ForbiddenError(
        "You are not allowed to confirm payment for this booking",
      );
    }
    if (bookingRequest.status !== "APPROVED") {
      throw new BadRequestError(
        "Booking request must be approved before confirming payment",
      );
    }
    if (bookingRequest.paymentMethod === "VNPAY") {
      throw new BadRequestError("Cannot manually confirm VNPAY payments");
    }

    const existingBooking = await prisma.booking.findFirst({
      where: {
        userId: bookingRequest.userId,
        roomId: bookingRequest.roomId,
        startTime: bookingRequest.startTime,
        endTime: bookingRequest.endTime,
      },
    });
    if (existingBooking) {
      throw new ConflictRequestError(
        "Payment has already been confirmed for this booking",
      );
    }

    const amount =
      bookingRequest.totalAmount ??
      this.calculateRoomAmount(
        bookingRequest.room.pricePerHour,
        bookingRequest.startTime,
        bookingRequest.endTime,
      );

    const result = await prisma.$transaction(
      async (tx) => {
        const booking = await tx.booking.create({
          data: {
            userId: bookingRequest.userId,
            roomId: bookingRequest.roomId,
            startTime: bookingRequest.startTime,
            endTime: bookingRequest.endTime,
            purpose: bookingRequest.purpose,
            status: "COMPLETED",
          },
        });

        await tx.bookingRequest.update({
          where: { id: bookingRequestId },
          data: { status: "COMPLETED" },
        });

        return booking;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    const transaction = await this.transactionRepo.create({
      bookingId: result.id,
      bookingRequestId,
      userId: bookingRequest.userId,
      amount,
      paymentMethod: bookingRequest.paymentMethod,
      status: "SUCCESS",
      paidAt: new Date(),
      confirmedBy: resolvedManagerId,
      note,
    });

    await this.mailQueueService.publishBookingConfirmedEmailJob({
      to: bookingRequest.user.email,
      customerName: bookingRequest.user.name,
      bookingId: result.id,
      roomName: bookingRequest.room.name,
      startTime: result.startTime.toISOString(),
      endTime: result.endTime.toISOString(),
    });

    return {
      booking: result,
      transaction,
      amount,
      paymentMethod: bookingRequest.paymentMethod,
    };
  }
}
