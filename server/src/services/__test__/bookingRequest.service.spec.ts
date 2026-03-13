import BookingRequestService from "../bookingRequest.service";
import { IBookingRequestRepository } from "../../interface/bookingRequest.repository.interface";
import { IRoomRepository } from "../../interface/room.repository.interface";
import { IBookingRepository } from "../../interface/booking.repository.interface";
import {
  BadRequestError,
  NotFoundError,
  ConflictRequestError,
} from "../../core/error.response";

describe("BookingRequestService", () => {
  let bookingRequestService: BookingRequestService;
  let mockBookingRequestRepo: jest.Mocked<IBookingRequestRepository>;
  let mockRoomRepo: jest.Mocked<IRoomRepository>;
  let mockBookingRepo: jest.Mocked<IBookingRepository>;

  const mockRoom = {
    id: "r-001",
    name: "Meeting Room A",
    roomCode: "ROOM-A",
    status: "AVAILABLE" as const,
    images: [],
    buildingId: "b-001",
    managerId: "m-001",
    pricePerHour: 50000,
    capacity: 10,
    roomType: "MEETING" as const,
    securityDeposit: null,
    description: null,
    area: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockBookingRequest = {
    id: "br-001",
    userId: "u-001",
    roomId: "r-001",
    startTime: new Date("2026-02-10T09:00:00Z"),
    endTime: new Date("2026-02-10T11:00:00Z"),
    purpose: "Team meeting",
    status: "PENDING" as const,
    approvedBy: null,
    createdAt: new Date(),
    room: {
      id: "r-001",
      name: "Meeting Room A",
      roomCode: "ROOM-A",
    },
    user: {
      id: "u-001",
      name: "Test User",
      email: "test@example.com",
    },
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
    bookingRequestService = new BookingRequestService(
      mockBookingRequestRepo,
      mockRoomRepo,
      mockBookingRepo,
    );
    jest.clearAllMocks();
  });

  describe("createBookingRequest()", () => {
    const validData = {
      userId: "u-001",
      roomId: "r-001",
      startTime: futureStartTime.toISOString(),
      endTime: futureEndTime.toISOString(),
      purpose: "Team meeting",
    };

    describe("Validation", () => {
      it("should throw BadRequestError if userId is missing", async () => {
        await expect(
          bookingRequestService.createBookingRequest({
            ...validData,
            userId: "",
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          bookingRequestService.createBookingRequest({
            ...validData,
            userId: "",
          }),
        ).rejects.toThrow("User ID is required");
      });

      it("should throw BadRequestError if roomId is missing", async () => {
        await expect(
          bookingRequestService.createBookingRequest({
            ...validData,
            roomId: "",
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          bookingRequestService.createBookingRequest({
            ...validData,
            roomId: "",
          }),
        ).rejects.toThrow("roomId is required");
      });

      it("should throw BadRequestError if startTime is missing", async () => {
        await expect(
          bookingRequestService.createBookingRequest({
            ...validData,
            startTime: "",
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          bookingRequestService.createBookingRequest({
            ...validData,
            startTime: "",
          }),
        ).rejects.toThrow("startTime is required");
      });

      it("should throw BadRequestError if endTime is missing", async () => {
        await expect(
          bookingRequestService.createBookingRequest({
            ...validData,
            endTime: "",
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          bookingRequestService.createBookingRequest({
            ...validData,
            endTime: "",
          }),
        ).rejects.toThrow("endTime is required");
      });

      it("should throw BadRequestError if startTime is invalid date", async () => {
        await expect(
          bookingRequestService.createBookingRequest({
            ...validData,
            startTime: "invalid-date",
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          bookingRequestService.createBookingRequest({
            ...validData,
            startTime: "invalid-date",
          }),
        ).rejects.toThrow("startTime must be a valid ISO 8601 date string");
      });

      it("should throw BadRequestError if endTime is invalid date", async () => {
        await expect(
          bookingRequestService.createBookingRequest({
            ...validData,
            endTime: "invalid-date",
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          bookingRequestService.createBookingRequest({
            ...validData,
            endTime: "invalid-date",
          }),
        ).rejects.toThrow("endTime must be a valid ISO 8601 date string");
      });

      it("should throw BadRequestError if endTime <= startTime", async () => {
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
        ).rejects.toThrow("endTime must be greater than startTime");
      });

      it("should throw BadRequestError if startTime is in the past", async () => {
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
        ).rejects.toThrow("Cannot book a room in the past");
      });
    });

    describe("Room Validation", () => {
      it("should throw NotFoundError if room not found", async () => {
        mockRoomRepo.findById.mockResolvedValue(null);

        await expect(
          bookingRequestService.createBookingRequest(validData),
        ).rejects.toThrow(NotFoundError);

        await expect(
          bookingRequestService.createBookingRequest(validData),
        ).rejects.toThrow("Room with id not found");

        expect(mockRoomRepo.findById).toHaveBeenCalledWith(validData.roomId);
      });

      it("should throw BadRequestError if room is not available", async () => {
        mockRoomRepo.findById.mockResolvedValue({
          ...mockRoom,
          status: "MAINTAIN" as const,
        });

        await expect(
          bookingRequestService.createBookingRequest(validData),
        ).rejects.toThrow(BadRequestError);

        await expect(
          bookingRequestService.createBookingRequest(validData),
        ).rejects.toThrow("is currently not available for booking");
      });
    });

    describe("Conflict Detection", () => {
      it("should throw ConflictRequestError if overlapping approved booking exists", async () => {
        mockRoomRepo.findById.mockResolvedValue(mockRoom);
        mockBookingRepo.findOverlappingApprovedBookings.mockResolvedValue([
          {
            id: "booking-001",
            userId: "u-002",
            roomId: "r-001",
            startTime: new Date("2026-02-10T08:00:00Z"),
            endTime: new Date("2026-02-10T10:00:00Z"),
            purpose: "Existing booking",
            status: "APPROVED" as const,
            createdAt: new Date(),
          },
        ]);

        await expect(
          bookingRequestService.createBookingRequest(validData),
        ).rejects.toThrow(ConflictRequestError);

        await expect(
          bookingRequestService.createBookingRequest(validData),
        ).rejects.toThrow("Room is already booked from");

        expect(
          mockBookingRepo.findOverlappingApprovedBookings,
        ).toHaveBeenCalledWith({
          roomId: validData.roomId,
          startTime: expect.any(Date),
          endTime: expect.any(Date),
        });
      });

      it("should throw ConflictRequestError if user has pending request for same time slot", async () => {
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
          "You already have a pending booking request for this room",
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

    describe("Success", () => {
      it("should create booking request successfully", async () => {
        mockRoomRepo.findById.mockResolvedValue(mockRoom);
        mockBookingRepo.findOverlappingApprovedBookings.mockResolvedValue([]);
        mockBookingRequestRepo.findOverlappingPendingRequests.mockResolvedValue(
          [],
        );
        mockBookingRequestRepo.create.mockResolvedValue(mockBookingRequest);

        const result =
          await bookingRequestService.createBookingRequest(validData);

        expect(result).toEqual(mockBookingRequest);
        expect(mockBookingRequestRepo.create).toHaveBeenCalledWith({
          userId: validData.userId,
          roomId: validData.roomId,
          startTime: expect.any(Date),
          endTime: expect.any(Date),
          purpose: validData.purpose,
        });
      });

      it("should create booking request without purpose", async () => {
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
        expect(mockBookingRequestRepo.create).toHaveBeenCalledWith({
          userId: dataWithoutPurpose.userId,
          roomId: dataWithoutPurpose.roomId,
          startTime: expect.any(Date),
          endTime: expect.any(Date),
          purpose: undefined,
        });
      });
    });
  });

  describe("getBookingRequestById()", () => {
    it("should return booking request if found", async () => {
      mockBookingRequestRepo.findById.mockResolvedValue(mockBookingRequest);

      const result =
        await bookingRequestService.getBookingRequestById("br-001");

      expect(result).toEqual(mockBookingRequest);
      expect(mockBookingRequestRepo.findById).toHaveBeenCalledWith("br-001");
    });

    it("should throw NotFoundError if booking request not found", async () => {
      mockBookingRequestRepo.findById.mockResolvedValue(null);

      await expect(
        bookingRequestService.getBookingRequestById("non-existent"),
      ).rejects.toThrow(NotFoundError);

      await expect(
        bookingRequestService.getBookingRequestById("non-existent"),
      ).rejects.toThrow("Booking request with id not found");
    });
  });
});
