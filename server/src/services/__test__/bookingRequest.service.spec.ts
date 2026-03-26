import BookingRequestService from '../bookingRequest.service';
import { IBookingRequestRepository } from '../../interface/bookingRequest.repository.interface';
import { IRoomRepository } from '../../interface/room.repository.interface';
import { IBookingRepository } from '../../interface/booking.repository.interface';
import {
  BadRequestError,
  NotFoundError,
  ConflictRequestError,
} from '../../core/error.response';
import MailQueueService from '../mailQueue.service';
import VnpayService from '../vnpay.service';

jest.mock('../../lib/prisma', () => ({
  prisma: {
    roomAmenity: {
      findMany: jest.fn(),
    },
    roomServiceCategory: {
      findMany: jest.fn(),
    },
    service: {
      findMany: jest.fn(),
    },
    amenity: {
      findMany: jest.fn(),
    },
    feedback: {
      findMany: jest.fn(),
    },
    bookingRequest: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    manager: {
      findFirst: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

import { prisma } from '../../lib/prisma';

const prismaMock = prisma as unknown as {
  roomAmenity: { findMany: jest.Mock };
  roomServiceCategory: { findMany: jest.Mock };
  service: { findMany: jest.Mock };
  amenity: { findMany: jest.Mock };
  feedback: { findMany: jest.Mock };
  bookingRequest: {
    findMany: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
    updateMany: jest.Mock;
  };
  manager: { findFirst: jest.Mock };
  $transaction: jest.Mock;
};

describe('BookingRequestService', () => {
  let bookingRequestService: BookingRequestService;
  let mockBookingRequestRepo: jest.Mocked<IBookingRequestRepository>;
  let mockRoomRepo: jest.Mocked<IRoomRepository>;
  let mockBookingRepo: jest.Mocked<IBookingRepository>;
  let mockMailQueueService: jest.Mocked<MailQueueService>;
  let mockVnpayService: jest.Mocked<VnpayService>;

  const mockRoom = {
    id: 'r-001',
    name: 'Meeting Room A',
    roomCode: 'ROOM-A',
    status: 'AVAILABLE' as const,
    images: [],
    buildingId: 'b-001',
    managerId: 'm-001',
    pricePerHour: 50000,
    capacity: 10,
    roomType: 'MEETING' as const,
    securityDeposit: null,
    description: null,
    area: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockBookingRequest = {
    id: 'br-001',
    userId: 'u-001',
    roomId: 'r-001',
    startTime: new Date('2026-02-10T09:00:00Z'),
    endTime: new Date('2026-02-10T11:00:00Z'),
    purpose: 'Team meeting',
    status: 'PENDING' as const,
    paymentMethod: 'VNPAY' as const,
    approvedBy: null,
    createdAt: new Date(),
  };

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7); // 7 days later

  const futureStartTime = new Date(futureDate);
  futureStartTime.setHours(9, 0, 0, 0);

  const futureEndTime = new Date(futureDate);
  futureEndTime.setHours(11, 0, 0, 0);

  beforeEach(() => {
    mockBookingRequestRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findOverlappingPendingRequests: jest.fn(),
    };
    mockRoomRepo = {
      findById: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      findByRoomCode: jest.fn(),
    };
    mockBookingRepo = {
      findOverlappingApprovedBookings: jest.fn(),
    };
    mockMailQueueService = {
      publishBookingConfirmedEmailJob: jest.fn(),
    } as unknown as jest.Mocked<MailQueueService>;
    mockVnpayService = {
      createPaymentUrl: jest.fn(),
      verifyQuery: jest.fn(),
      extractBookingRequestId: jest.fn(),
    } as unknown as jest.Mocked<VnpayService>;
    const mockTransactionRepo: any = {
      create: jest.fn(),
      findById: jest.fn(),
      findByBookingId: jest.fn(),
      findMany: jest.fn(),
      updateStatus: jest.fn(),
      getRevenueSummary: jest.fn(),
      getTotalRevenue: jest.fn(),
    };
    bookingRequestService = new BookingRequestService(
      mockBookingRequestRepo,
      mockRoomRepo,
      mockBookingRepo,
      mockMailQueueService,
      mockVnpayService,
      mockTransactionRepo,
    );
    prismaMock.roomAmenity.findMany.mockResolvedValue([]);
    prismaMock.roomServiceCategory.findMany.mockResolvedValue([]);
    prismaMock.service.findMany.mockResolvedValue([]);
    prismaMock.amenity.findMany.mockResolvedValue([]);
    prismaMock.feedback.findMany.mockResolvedValue([]);
    jest.clearAllMocks();
  });

  describe('createBookingRequest()', () => {
    const validData = {
      userId: 'u-001',
      roomId: 'r-001',
      startTime: futureStartTime.toISOString(),
      endTime: futureEndTime.toISOString(),
      purpose: 'Team meeting',
    };

    describe('Validation', () => {
      it('should throw BadRequestError if selected amenity does not belong to room', async () => {
        mockRoomRepo.findById.mockResolvedValue(mockRoom);
        prismaMock.roomAmenity.findMany.mockResolvedValue([]);

        await expect(
          bookingRequestService.createBookingRequest({
            ...validData,
            amenityIds: ['amenity-1'],
          }),
        ).rejects.toThrow(
          'One or more selected amenities are not available for this room',
        );
      });

      it('should throw BadRequestError if service quantity is less than 1', async () => {
        mockRoomRepo.findById.mockResolvedValue(mockRoom);
        prismaMock.roomServiceCategory.findMany.mockResolvedValue([
          {
            category: {
              services: [{ id: 'service-1' }],
            },
          },
        ]);

        await expect(
          bookingRequestService.createBookingRequest({
            ...validData,
            services: [{ serviceId: 'service-1', quantity: 0 }],
          }),
        ).rejects.toThrow('Service quantity must be at least 1');
      });

      it('should throw BadRequestError if userId is missing', async () => {
        await expect(
          bookingRequestService.createBookingRequest({
            ...validData,
            userId: '',
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          bookingRequestService.createBookingRequest({
            ...validData,
            userId: '',
          }),
        ).rejects.toThrow('User ID is required');
      });

      it('should throw BadRequestError if roomId is missing', async () => {
        await expect(
          bookingRequestService.createBookingRequest({
            ...validData,
            roomId: '',
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          bookingRequestService.createBookingRequest({
            ...validData,
            roomId: '',
          }),
        ).rejects.toThrow('roomId is required');
      });

      it('should throw BadRequestError if startTime is missing', async () => {
        await expect(
          bookingRequestService.createBookingRequest({
            ...validData,
            startTime: '',
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          bookingRequestService.createBookingRequest({
            ...validData,
            startTime: '',
          }),
        ).rejects.toThrow('startTime is required');
      });

      it('should throw BadRequestError if endTime is missing', async () => {
        await expect(
          bookingRequestService.createBookingRequest({
            ...validData,
            endTime: '',
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          bookingRequestService.createBookingRequest({
            ...validData,
            endTime: '',
          }),
        ).rejects.toThrow('endTime is required');
      });

      it('should throw BadRequestError if startTime is invalid date', async () => {
        await expect(
          bookingRequestService.createBookingRequest({
            ...validData,
            startTime: 'invalid-date',
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          bookingRequestService.createBookingRequest({
            ...validData,
            startTime: 'invalid-date',
          }),
        ).rejects.toThrow('startTime must be a valid ISO 8601 date string');
      });

      it('should throw BadRequestError if endTime is invalid date', async () => {
        await expect(
          bookingRequestService.createBookingRequest({
            ...validData,
            endTime: 'invalid-date',
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          bookingRequestService.createBookingRequest({
            ...validData,
            endTime: 'invalid-date',
          }),
        ).rejects.toThrow('endTime must be a valid ISO 8601 date string');
      });

      it('should throw BadRequestError if endTime <= startTime', async () => {
        await expect(
          bookingRequestService.createBookingRequest({
            ...validData,
            startTime: futureEndTime.toISOString(),
            endTime: futureStartTime.toISOString(),
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          bookingRequestService.createBookingRequest({
            ...validData,
            startTime: futureEndTime.toISOString(),
            endTime: futureStartTime.toISOString(),
          }),
        ).rejects.toThrow('endTime must be greater than startTime');
      });

      it('should throw BadRequestError if startTime is in the past', async () => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1);

        await expect(
          bookingRequestService.createBookingRequest({
            ...validData,
            startTime: pastDate.toISOString(),
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          bookingRequestService.createBookingRequest({
            ...validData,
            startTime: pastDate.toISOString(),
          }),
        ).rejects.toThrow('Cannot book a room in the past');
      });
    });

    describe('Room Validation', () => {
      it('should throw NotFoundError if room not found', async () => {
        mockRoomRepo.findById.mockResolvedValue(null);

        await expect(
          bookingRequestService.createBookingRequest(validData),
        ).rejects.toThrow(NotFoundError);

        await expect(
          bookingRequestService.createBookingRequest(validData),
        ).rejects.toThrow('Room with id not found');

        expect(mockRoomRepo.findById).toHaveBeenCalledWith(validData.roomId);
      });

      it('should throw BadRequestError if room is not available', async () => {
        mockRoomRepo.findById.mockResolvedValue({
          ...mockRoom,
          status: 'MAINTAIN' as const,
        });

        await expect(
          bookingRequestService.createBookingRequest(validData),
        ).rejects.toThrow(BadRequestError);

        await expect(
          bookingRequestService.createBookingRequest(validData),
        ).rejects.toThrow('is currently not available for booking');
      });
    });

    describe('Conflict Detection', () => {
      it('should throw ConflictRequestError if overlapping approved booking exists', async () => {
        mockRoomRepo.findById.mockResolvedValue(mockRoom);
        mockBookingRepo.findOverlappingApprovedBookings.mockResolvedValue([
          {
            id: 'booking-001',
            userId: 'u-002',
            roomId: 'r-001',
            startTime: new Date('2026-02-10T08:00:00Z'),
            endTime: new Date('2026-02-10T10:00:00Z'),
            purpose: 'Existing booking',
            status: 'APPROVED' as const,
            createdAt: new Date(),
          },
        ]);

        await expect(
          bookingRequestService.createBookingRequest(validData),
        ).rejects.toThrow(ConflictRequestError);

        await expect(
          bookingRequestService.createBookingRequest(validData),
        ).rejects.toThrow('Room is already booked from');

        expect(
          mockBookingRepo.findOverlappingApprovedBookings,
        ).toHaveBeenCalledWith({
          roomId: validData.roomId,
          startTime: expect.any(Date),
          endTime: expect.any(Date),
        });
      });

      it('should throw ConflictRequestError if user has pending request for same time slot', async () => {
        mockRoomRepo.findById.mockResolvedValue(mockRoom);
        mockBookingRepo.findOverlappingApprovedBookings.mockResolvedValue([]);
        mockBookingRequestRepo.findOverlappingPendingRequests.mockResolvedValue(
          [
            {
              id: 'br-existing',
              userId: 'u-001',
              roomId: 'r-001',
              startTime: new Date('2026-02-10T09:00:00Z'),
              endTime: new Date('2026-02-10T11:00:00Z'),
              purpose: 'Existing request',
              status: 'PENDING' as const,
              paymentMethod: 'VNPAY' as const,
              approvedBy: null,
              createdAt: new Date(),
            },
          ],
        );

        await expect(
          bookingRequestService.createBookingRequest(validData),
        ).rejects.toThrow(ConflictRequestError);

        await expect(
          bookingRequestService.createBookingRequest(validData),
        ).rejects.toThrow(
          'You already have a pending booking request for this room',
        );

        expect(
          mockBookingRequestRepo.findOverlappingPendingRequests,
        ).toHaveBeenCalledWith({
          roomId: validData.roomId,
          userId: validData.userId,
          startTime: expect.any(Date),
          endTime: expect.any(Date),
        });
      });
    });

    describe('Success', () => {
      it('should create booking request successfully', async () => {
        mockRoomRepo.findById.mockResolvedValue(mockRoom);
        mockBookingRepo.findOverlappingApprovedBookings.mockResolvedValue([]);
        mockBookingRequestRepo.findOverlappingPendingRequests.mockResolvedValue(
          [],
        );
        mockBookingRequestRepo.create.mockResolvedValue(mockBookingRequest);

        const result =
          await bookingRequestService.createBookingRequest(validData);

        expect(result).toEqual({
          ...mockBookingRequest,
          amenities: [],
          services: [],
          totalCost: 100000,
        });
        expect(mockBookingRequestRepo.create).toHaveBeenCalledWith({
          userId: validData.userId,
          roomId: validData.roomId,
          startTime: expect.any(Date),
          endTime: expect.any(Date),
          purpose: validData.purpose,
          paymentMethod: 'VNPAY',
        });
      });

      it('should create booking request with amenities/services and calculate totalCost', async () => {
        mockRoomRepo.findById.mockResolvedValue(mockRoom);
        mockBookingRepo.findOverlappingApprovedBookings.mockResolvedValue([]);
        mockBookingRequestRepo.findOverlappingPendingRequests.mockResolvedValue(
          [],
        );
        mockBookingRequestRepo.create.mockResolvedValue(mockBookingRequest);
        prismaMock.roomAmenity.findMany.mockResolvedValue([
          { roomId: 'r-001', amenityId: 'amenity-1' },
        ]);
        prismaMock.roomServiceCategory.findMany.mockResolvedValue([
          {
            category: {
              services: [{ id: 'service-1' }],
            },
          },
        ]);
        prismaMock.service.findMany.mockResolvedValue([
          { id: 'service-1', name: 'Projector', price: 15000 },
        ]);
        prismaMock.amenity.findMany.mockResolvedValue([
          { id: 'amenity-1', name: 'Whiteboard' },
        ]);

        const result = await bookingRequestService.createBookingRequest({
          ...validData,
          amenityIds: ['amenity-1'],
          services: [{ serviceId: 'service-1', quantity: 2 }],
        });

        expect(result.totalCost).toBe(130000);
        expect(result.amenities).toEqual([
          { id: 'amenity-1', name: 'Whiteboard' },
        ]);
        expect(result.services).toEqual([
          {
            serviceId: 'service-1',
            name: 'Projector',
            price: 15000,
            quantity: 2,
            lineTotal: 30000,
          },
        ]);
      });

      it('should create booking request without purpose', async () => {
        const dataWithoutPurpose = { ...validData, purpose: undefined };

        mockRoomRepo.findById.mockResolvedValue(mockRoom);
        mockBookingRepo.findOverlappingApprovedBookings.mockResolvedValue([]);
        mockBookingRequestRepo.findOverlappingPendingRequests.mockResolvedValue(
          [],
        );
        mockBookingRequestRepo.create.mockResolvedValue({
          ...mockBookingRequest,
          purpose: null,
        });

        const result =
          await bookingRequestService.createBookingRequest(dataWithoutPurpose);

        expect(result.purpose).toBeNull();
        expect(result.totalCost).toBe(100000);
        expect(mockBookingRequestRepo.create).toHaveBeenCalledWith({
          userId: dataWithoutPurpose.userId,
          roomId: dataWithoutPurpose.roomId,
          startTime: expect.any(Date),
          endTime: expect.any(Date),
          purpose: undefined,
          paymentMethod: 'VNPAY',
        });
      });
    });
  });

  describe('createBookingRequestAndPaymentUrlForMobile()', () => {
    it('should auto-approve newly created request and return payment url', async () => {
      const startTime = futureStartTime.toISOString();
      const endTime = futureEndTime.toISOString();

      jest
        .spyOn(bookingRequestService, 'createBookingRequest')
        .mockResolvedValue({ id: 'br-mobile-1' } as any);
      jest
        .spyOn(
          bookingRequestService,
          'createPaymentUrlForApprovedBookingRequest',
        )
        .mockResolvedValue({
          paymentUrl: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...',
          txnRef: 'br_br-mobile-1_1710000000000',
          amount: 100000,
          bookingRequestId: 'br-mobile-1',
          roomName: 'Meeting Room A',
        });

      mockRoomRepo.findById.mockResolvedValue(mockRoom);
      prismaMock.bookingRequest.update.mockResolvedValue({
        id: 'br-mobile-1',
      });

      const result =
        await bookingRequestService.createBookingRequestAndPaymentUrlForMobile({
          userId: 'u-001',
          roomId: 'r-001',
          startTime,
          endTime,
          ipAddr: '127.0.0.1',
          locale: 'vn',
        });

      expect(prismaMock.bookingRequest.update).toHaveBeenCalledWith({
        where: { id: 'br-mobile-1' },
        data: {
          status: 'APPROVED',
          approvedBy: 'm-001',
        },
      });
      expect(result).toEqual(
        expect.objectContaining({
          bookingRequestId: 'br-mobile-1',
          status: 'APPROVED',
          paymentUrl: expect.any(String),
        }),
      );
    });
  });

  describe('getMyBookingRequests()', () => {
    it('should return booking requests with hasFeedback flag', async () => {
      prismaMock.bookingRequest.findMany.mockResolvedValue([
        {
          id: 'br-1',
          userId: 'u-001',
          roomId: 'r-001',
          startTime: new Date('2026-04-10T09:00:00.000Z'),
          endTime: new Date('2026-04-10T11:00:00.000Z'),
          purpose: 'Review meeting',
          status: 'COMPLETED',
          approvedBy: 'm-001',
          createdAt: new Date('2026-04-01T09:00:00.000Z'),
          room: {
            id: 'r-001',
            name: 'Meeting Room A',
            roomCode: 'ROOM-A',
            building: {
              id: 'b-001',
              buildingName: 'A',
              campus: 'HCM',
            },
          },
        },
        {
          id: 'br-2',
          userId: 'u-001',
          roomId: 'r-002',
          startTime: new Date('2026-04-12T09:00:00.000Z'),
          endTime: new Date('2026-04-12T11:00:00.000Z'),
          purpose: 'Client demo',
          status: 'COMPLETED',
          approvedBy: 'm-001',
          createdAt: new Date('2026-04-02T09:00:00.000Z'),
          room: {
            id: 'r-002',
            name: 'Meeting Room B',
            roomCode: 'ROOM-B',
            building: {
              id: 'b-001',
              buildingName: 'A',
              campus: 'HCM',
            },
          },
        },
      ]);
      prismaMock.feedback.findMany.mockResolvedValue([{ roomId: 'r-001' }]);

      const result = await bookingRequestService.getMyBookingRequests(
        'u-001',
        'COMPLETED',
      );

      expect(prismaMock.feedback.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'u-001',
          roomId: {
            in: ['r-001', 'r-002'],
          },
        },
        select: {
          roomId: true,
        },
      });

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 'br-1', hasFeedback: true }),
          expect.objectContaining({ id: 'br-2', hasFeedback: false }),
        ]),
      );
    });
  });

  describe('getBookingRequestById()', () => {
    it('should return booking request if found', async () => {
      mockBookingRequestRepo.findById.mockResolvedValue(mockBookingRequest);

      const result =
        await bookingRequestService.getBookingRequestById('br-001');

      expect(result).toEqual(mockBookingRequest);
      expect(mockBookingRequestRepo.findById).toHaveBeenCalledWith('br-001');
    });

    it('should throw NotFoundError if booking request not found', async () => {
      mockBookingRequestRepo.findById.mockResolvedValue(null);

      await expect(
        bookingRequestService.getBookingRequestById('non-existent'),
      ).rejects.toThrow(NotFoundError);

      await expect(
        bookingRequestService.getBookingRequestById('non-existent'),
      ).rejects.toThrow('Booking request with id not found');
    });
  });

  describe('cancelMyBookingRequest()', () => {
    it('should cancel own booking request when not completed', async () => {
      prismaMock.bookingRequest.findUnique
        .mockResolvedValueOnce({
          id: 'br-1',
          userId: 'u-001',
          status: 'APPROVED',
        })
        .mockResolvedValueOnce({
          id: 'br-1',
          userId: 'u-001',
          status: 'CANCELLED',
        });
      prismaMock.bookingRequest.updateMany.mockResolvedValue({ count: 1 });

      const result = await bookingRequestService.cancelMyBookingRequest(
        'br-1',
        'u-001',
      );

      expect(prismaMock.bookingRequest.updateMany).toHaveBeenCalledWith({
        where: {
          id: 'br-1',
          userId: 'u-001',
          status: {
            notIn: ['COMPLETED', 'CANCELLED'],
          },
        },
        data: {
          status: 'CANCELLED',
        },
      });
      expect(result).toEqual(
        expect.objectContaining({ id: 'br-1', status: 'CANCELLED' }),
      );
    });

    it('should throw conflict when booking request is completed', async () => {
      prismaMock.bookingRequest.findUnique.mockResolvedValue({
        id: 'br-1',
        userId: 'u-001',
        status: 'COMPLETED',
      });

      await expect(
        bookingRequestService.cancelMyBookingRequest('br-1', 'u-001'),
      ).rejects.toThrow(ConflictRequestError);
      await expect(
        bookingRequestService.cancelMyBookingRequest('br-1', 'u-001'),
      ).rejects.toThrow('Cannot cancel a completed booking request');
    });

    it("should throw forbidden when cancelling another user's request", async () => {
      prismaMock.bookingRequest.findUnique.mockResolvedValue({
        id: 'br-1',
        userId: 'u-999',
        status: 'PENDING',
      });

      await expect(
        bookingRequestService.cancelMyBookingRequest('br-1', 'u-001'),
      ).rejects.toThrow('You are not allowed to cancel this booking request');
    });
  });

  describe('processVnpayPayment()', () => {
    it('should set bookingRequest and booking status to COMPLETED when payment succeeds', async () => {
      mockVnpayService.verifyQuery.mockReturnValue(true);
      mockVnpayService.extractBookingRequestId.mockReturnValue('br-001');

      const tx = {
        bookingRequest: {
          findUnique: jest.fn().mockResolvedValue({
            id: 'br-001',
            userId: 'u-001',
            roomId: 'r-001',
            startTime: new Date('2026-02-10T09:00:00Z'),
            endTime: new Date('2026-02-10T11:00:00Z'),
            purpose: 'Team meeting',
            status: 'APPROVED',
            user: {
              id: 'u-001',
              name: 'Test User',
              email: 'test@example.com',
            },
            room: {
              id: 'r-001',
              name: 'Meeting Room A',
            },
          }),
          update: jest
            .fn()
            .mockResolvedValue({ id: 'br-001', status: 'COMPLETED' }),
        },
        booking: {
          findFirst: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue({
            id: 'b-001',
            status: 'COMPLETED',
            startTime: new Date('2026-02-10T09:00:00Z'),
            endTime: new Date('2026-02-10T11:00:00Z'),
          }),
          update: jest.fn(),
        },
      };

      prismaMock.$transaction.mockImplementation(async (callback: any) =>
        callback(tx),
      );

      const result = await bookingRequestService.processVnpayPayment({
        vnp_TxnRef: 'txn-ref-1',
        vnp_ResponseCode: '00',
        vnp_TransactionStatus: '00',
        vnp_SecureHash: 'valid-hash',
      });

      expect(tx.booking.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ status: 'COMPLETED' }),
      });
      expect(tx.bookingRequest.update).toHaveBeenCalledWith({
        where: { id: 'br-001' },
        data: { status: 'COMPLETED' },
      });
      expect(result).toEqual(
        expect.objectContaining({
          success: true,
          bookingRequestId: 'br-001',
          bookingId: 'b-001',
          alreadyProcessed: false,
        }),
      );
    });

    it('should complete existing APPROVED booking and bookingRequest on successful reprocessing', async () => {
      mockVnpayService.verifyQuery.mockReturnValue(true);
      mockVnpayService.extractBookingRequestId.mockReturnValue('br-001');

      const tx = {
        bookingRequest: {
          findUnique: jest.fn().mockResolvedValue({
            id: 'br-001',
            userId: 'u-001',
            roomId: 'r-001',
            startTime: new Date('2026-02-10T09:00:00Z'),
            endTime: new Date('2026-02-10T11:00:00Z'),
            purpose: 'Team meeting',
            status: 'APPROVED',
            user: {
              id: 'u-001',
              name: 'Test User',
              email: 'test@example.com',
            },
            room: {
              id: 'r-001',
              name: 'Meeting Room A',
            },
          }),
          update: jest
            .fn()
            .mockResolvedValue({ id: 'br-001', status: 'COMPLETED' }),
        },
        booking: {
          findFirst: jest.fn().mockResolvedValue({
            id: 'b-001',
            status: 'APPROVED',
            startTime: new Date('2026-02-10T09:00:00Z'),
            endTime: new Date('2026-02-10T11:00:00Z'),
          }),
          create: jest.fn(),
          update: jest.fn().mockResolvedValue({
            id: 'b-001',
            status: 'COMPLETED',
            startTime: new Date('2026-02-10T09:00:00Z'),
            endTime: new Date('2026-02-10T11:00:00Z'),
          }),
        },
      };

      prismaMock.$transaction.mockImplementation(async (callback: any) =>
        callback(tx),
      );

      const result = await bookingRequestService.processVnpayPayment({
        vnp_TxnRef: 'txn-ref-1',
        vnp_ResponseCode: '00',
        vnp_TransactionStatus: '00',
        vnp_SecureHash: 'valid-hash',
      });

      expect(tx.booking.update).toHaveBeenCalledWith({
        where: { id: 'b-001' },
        data: { status: 'COMPLETED' },
      });
      expect(tx.bookingRequest.update).toHaveBeenCalledWith({
        where: { id: 'br-001' },
        data: { status: 'COMPLETED' },
      });
      expect(result).toEqual(
        expect.objectContaining({
          success: true,
          bookingRequestId: 'br-001',
          bookingId: 'b-001',
          alreadyProcessed: true,
        }),
      );
      expect(
        mockMailQueueService.publishBookingConfirmedEmailJob,
      ).not.toHaveBeenCalled();
    });
  });
});
