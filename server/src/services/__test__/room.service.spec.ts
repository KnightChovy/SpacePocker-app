import RoomService from "../room.service";
import { IRoomRepository } from "../../interface/room.repository.interface";
import { IBuildingRepository } from "../../interface/building.repository.interface";
import {
  BadRequestError,
  NotFoundError,
  ConflictRequestError,
} from "../../core/error.response";

describe("RoomService", () => {
  let roomService: RoomService;
  let mockRoomRepo: jest.Mocked<IRoomRepository>;
  let mockBuildingRepo: jest.Mocked<IBuildingRepository>;

  const mockBuilding = {
    id: "b-001",
    buildingName: "Building A",
    campus: "Main Campus",
    address: "123 Main Street",
    latitude: null,
    longitude: null,
    managerId: "m-001",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRoom = {
    id: "r-001",
    buildingId: "b-001",
    managerId: "m-001",
    name: "Conference Room A",
    status: "AVAILABLE" as const,
    images: [],
    description: "Large conference room",
    pricePerHour: 50,
    securityDeposit: 100,
    capacity: 20,
    roomType: "MEETING" as const,
    area: 50.5,
    roomCode: "ROOM-A-001",
    createdAt: new Date(),
    updatedAt: new Date(),
    building: mockBuilding,
    manager: {
      id: "m-001",
      name: "Manager",
      email: "manager@example.com",
      phoneNumber: null,
      role: "MANAGER" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    amenities: [],
    bookingRequests: [],
    bookings: [],
  };

  beforeEach(() => {
    mockRoomRepo = {
      findById: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      findByRoomCode: jest.fn(),
    };
    mockBuildingRepo = {
      findById: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    };
    roomService = new RoomService(mockRoomRepo, mockBuildingRepo);
    jest.clearAllMocks();
    // Default to off-peak: 10:00 AM Vietnam time = 03:00 UTC
    jest
      .spyOn(Date, 'now')
      .mockReturnValue(new Date('2026-01-01T03:00:00Z').getTime());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("createRoom()", () => {
    const validData = {
      buildingId: "b-001",
      managerId: "m-001",
      name: "Conference Room A",
      description: "Large conference room",
      pricePerHour: 50,
      securityDeposit: 100,
      capacity: 20,
      roomType: "MEETING" as const,
      area: 50.5,
      roomCode: "ROOM-A-001",
    };

    describe("Validation", () => {
      it("should throw BadRequestError if buildingId is missing", async () => {
        await expect(
          roomService.createRoom({
            ...validData,
            buildingId: "",
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          roomService.createRoom({
            ...validData,
            buildingId: "",
          }),
        ).rejects.toThrow("Building ID is required");
      });

      it("should throw BadRequestError if managerId is missing", async () => {
        await expect(
          roomService.createRoom({
            ...validData,
            managerId: "",
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          roomService.createRoom({
            ...validData,
            managerId: "",
          }),
        ).rejects.toThrow("Manager ID is required");
      });

      it("should throw BadRequestError if name is missing", async () => {
        await expect(
          roomService.createRoom({
            ...validData,
            name: "",
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          roomService.createRoom({
            ...validData,
            name: "",
          }),
        ).rejects.toThrow("Room name is required");
      });

      it("should throw BadRequestError if name is only whitespace", async () => {
        await expect(
          roomService.createRoom({
            ...validData,
            name: "   ",
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          roomService.createRoom({
            ...validData,
            name: "   ",
          }),
        ).rejects.toThrow("Room name is required");
      });

      it("should throw BadRequestError if pricePerHour is 0", async () => {
        await expect(
          roomService.createRoom({
            ...validData,
            pricePerHour: 0,
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          roomService.createRoom({
            ...validData,
            pricePerHour: 0,
          }),
        ).rejects.toThrow("Price per hour must be greater than 0");
      });

      it("should throw BadRequestError if pricePerHour is negative", async () => {
        await expect(
          roomService.createRoom({
            ...validData,
            pricePerHour: -50,
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          roomService.createRoom({
            ...validData,
            pricePerHour: -50,
          }),
        ).rejects.toThrow("Price per hour must be greater than 0");
      });

      it("should throw BadRequestError if capacity is 0", async () => {
        await expect(
          roomService.createRoom({
            ...validData,
            capacity: 0,
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          roomService.createRoom({
            ...validData,
            capacity: 0,
          }),
        ).rejects.toThrow("Capacity must be greater than 0");
      });

      it("should throw BadRequestError if capacity is negative", async () => {
        await expect(
          roomService.createRoom({
            ...validData,
            capacity: -10,
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          roomService.createRoom({
            ...validData,
            capacity: -10,
          }),
        ).rejects.toThrow("Capacity must be greater than 0");
      });

      it("should throw BadRequestError if roomType is missing", async () => {
        await expect(
          roomService.createRoom({
            ...validData,
            roomType: "" as any,
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          roomService.createRoom({
            ...validData,
            roomType: "" as any,
          }),
        ).rejects.toThrow("Room type is required");
      });

      it("should throw BadRequestError if roomCode is missing", async () => {
        await expect(
          roomService.createRoom({
            ...validData,
            roomCode: "",
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          roomService.createRoom({
            ...validData,
            roomCode: "",
          }),
        ).rejects.toThrow("Room code is required");
      });

      it("should throw BadRequestError if roomCode is only whitespace", async () => {
        await expect(
          roomService.createRoom({
            ...validData,
            roomCode: "   ",
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          roomService.createRoom({
            ...validData,
            roomCode: "   ",
          }),
        ).rejects.toThrow("Room code is required");
      });
    });

    describe("Building Validation", () => {
      it("should throw NotFoundError if building not found", async () => {
        mockBuildingRepo.findById.mockResolvedValue(null);

        await expect(roomService.createRoom(validData)).rejects.toThrow(
          NotFoundError,
        );

        await expect(roomService.createRoom(validData)).rejects.toThrow(
          "Building not found",
        );

        expect(mockBuildingRepo.findById).toHaveBeenCalledWith(
          validData.buildingId,
        );
      });
    });

    describe("Room Code Uniqueness", () => {
      it("should throw ConflictRequestError if room code already exists", async () => {
        mockBuildingRepo.findById.mockResolvedValue(mockBuilding);
        mockRoomRepo.findByRoomCode.mockResolvedValue(mockRoom);

        await expect(roomService.createRoom(validData)).rejects.toThrow(
          ConflictRequestError,
        );

        await expect(roomService.createRoom(validData)).rejects.toThrow(
          `Room code '${validData.roomCode}' already exists`,
        );

        expect(mockRoomRepo.findByRoomCode).toHaveBeenCalledWith(
          validData.roomCode,
        );
      });
    });

    describe("Success", () => {
      it("should create room successfully with all fields", async () => {
        mockBuildingRepo.findById.mockResolvedValue(mockBuilding);
        mockRoomRepo.findByRoomCode.mockResolvedValue(null);
        mockRoomRepo.create.mockResolvedValue(mockRoom);

        const result = await roomService.createRoom(validData);

        expect(result).toEqual({ room: mockRoom });
        expect(mockRoomRepo.create).toHaveBeenCalledWith(validData);
      });

      it("should create room successfully with optional fields undefined", async () => {
        const dataWithoutOptional = {
          buildingId: "b-001",
          managerId: "m-001",
          name: "Simple Room",
          pricePerHour: 30,
          capacity: 10,
          roomType: "CLASSROOM" as const,
          roomCode: "ROOM-B-001",
        };

        const roomWithoutOptional = {
          ...mockRoom,
          description: undefined,
          securityDeposit: undefined,
          area: undefined,
        };

        mockBuildingRepo.findById.mockResolvedValue(mockBuilding);
        mockRoomRepo.findByRoomCode.mockResolvedValue(null);
        mockRoomRepo.create.mockResolvedValue(roomWithoutOptional as any);

        const result = await roomService.createRoom(dataWithoutOptional);

        expect(result).toEqual({ room: roomWithoutOptional });
        expect(mockRoomRepo.create).toHaveBeenCalledWith(dataWithoutOptional);
      });
    });
  });

  describe("getRoomById()", () => {
    it("should throw BadRequestError if roomId is missing", async () => {
      await expect(roomService.getRoomById("")).rejects.toThrow(
        BadRequestError,
      );

      await expect(roomService.getRoomById("")).rejects.toThrow(
        "Room ID is required",
      );
    });

    it("should throw NotFoundError if room not found", async () => {
      mockRoomRepo.findById.mockResolvedValue(null);

      await expect(roomService.getRoomById("non-existent")).rejects.toThrow(
        NotFoundError,
      );

      await expect(roomService.getRoomById("non-existent")).rejects.toThrow(
        "Room not found",
      );

      expect(mockRoomRepo.findById).toHaveBeenCalledWith("non-existent");
    });

    it("should return room if found", async () => {
      mockRoomRepo.findById.mockResolvedValue(mockRoom);

      const result = await roomService.getRoomById("r-001");

      expect(result.room).toEqual(expect.objectContaining(mockRoom));
      expect(mockRoomRepo.findById).toHaveBeenCalledWith("r-001");
    });
  });

  describe("getAllRooms()", () => {
    const mockRooms = [mockRoom];

    describe("Filtering", () => {
      it("should filter by search query (name and roomCode)", async () => {
        mockRoomRepo.count.mockResolvedValue(1);
        mockRoomRepo.findAll.mockResolvedValue(mockRooms);

        const result = await roomService.getAllRooms({ search: "Conference" });

        expect(mockRoomRepo.findAll).toHaveBeenCalledWith(
          expect.objectContaining({
            OR: [
              { name: { contains: "Conference", mode: "insensitive" } },
              { roomCode: { contains: "Conference", mode: "insensitive" } },
            ],
          }),
          undefined,
          10,
          0,
        );
        expect(result.rooms[0]).toEqual(expect.objectContaining(mockRooms[0]));
      });

      it("should filter by buildingId", async () => {
        mockRoomRepo.count.mockResolvedValue(1);
        mockRoomRepo.findAll.mockResolvedValue(mockRooms);

        await roomService.getAllRooms({ buildingId: "b-001" });

        expect(mockRoomRepo.findAll).toHaveBeenCalledWith(
          expect.objectContaining({ buildingId: "b-001" }),
          undefined,
          10,
          0,
        );
      });

      it("should filter by roomType", async () => {
        mockRoomRepo.count.mockResolvedValue(1);
        mockRoomRepo.findAll.mockResolvedValue(mockRooms);

        await roomService.getAllRooms({ roomType: "MEETING" });

        expect(mockRoomRepo.findAll).toHaveBeenCalledWith(
          expect.objectContaining({ roomType: "MEETING" }),
          undefined,
          10,
          0,
        );
      });

      it("should filter by status (AVAILABLE)", async () => {
        mockRoomRepo.count.mockResolvedValue(1);
        mockRoomRepo.findAll.mockResolvedValue(mockRooms);

        await roomService.getAllRooms({ status: "AVAILABLE" });

        expect(mockRoomRepo.findAll).toHaveBeenCalledWith(
          expect.objectContaining({ status: "AVAILABLE" }),
          undefined,
          10,
          0,
        );
      });

      it("should filter by status (MAINTAIN)", async () => {
        mockRoomRepo.count.mockResolvedValue(1);
        mockRoomRepo.findAll.mockResolvedValue(mockRooms);

        await roomService.getAllRooms({ status: "MAINTAIN" });

        expect(mockRoomRepo.findAll).toHaveBeenCalledWith(
          expect.objectContaining({ status: "MAINTAIN" }),
          undefined,
          10,
          0,
        );
      });

      it("should filter by minPrice", async () => {
        mockRoomRepo.count.mockResolvedValue(1);
        mockRoomRepo.findAll.mockResolvedValue(mockRooms);

        await roomService.getAllRooms({ minPrice: 30 });

        expect(mockRoomRepo.findAll).toHaveBeenCalledWith(
          expect.objectContaining({ pricePerHour: { gte: 30 } }),
          undefined,
          10,
          0,
        );
      });

      it("should filter by maxPrice", async () => {
        mockRoomRepo.count.mockResolvedValue(1);
        mockRoomRepo.findAll.mockResolvedValue(mockRooms);

        await roomService.getAllRooms({ maxPrice: 100 });

        expect(mockRoomRepo.findAll).toHaveBeenCalledWith(
          expect.objectContaining({ pricePerHour: { lte: 100 } }),
          undefined,
          10,
          0,
        );
      });

      it("should filter by minPrice and maxPrice", async () => {
        mockRoomRepo.count.mockResolvedValue(1);
        mockRoomRepo.findAll.mockResolvedValue(mockRooms);

        await roomService.getAllRooms({ minPrice: 30, maxPrice: 100 });

        expect(mockRoomRepo.findAll).toHaveBeenCalledWith(
          expect.objectContaining({ pricePerHour: { gte: 30, lte: 100 } }),
          undefined,
          10,
          0,
        );
      });

      it("should filter by minCapacity", async () => {
        mockRoomRepo.count.mockResolvedValue(1);
        mockRoomRepo.findAll.mockResolvedValue(mockRooms);

        await roomService.getAllRooms({ minCapacity: 10 });

        expect(mockRoomRepo.findAll).toHaveBeenCalledWith(
          expect.objectContaining({ capacity: { gte: 10 } }),
          undefined,
          10,
          0,
        );
      });
    });

    describe("Sorting", () => {
      it("should sort by name ascending", async () => {
        mockRoomRepo.count.mockResolvedValue(1);
        mockRoomRepo.findAll.mockResolvedValue(mockRooms);

        await roomService.getAllRooms({ sortBy: "name", sortOrder: "asc" });

        expect(mockRoomRepo.findAll).toHaveBeenCalledWith(
          undefined,
          { name: "asc" },
          10,
          0,
        );
      });

      it("should sort by pricePerHour descending", async () => {
        mockRoomRepo.count.mockResolvedValue(1);
        mockRoomRepo.findAll.mockResolvedValue(mockRooms);

        await roomService.getAllRooms({
          sortBy: "pricePerHour",
          sortOrder: "desc",
        });

        expect(mockRoomRepo.findAll).toHaveBeenCalledWith(
          undefined,
          { pricePerHour: "desc" },
          10,
          0,
        );
      });

      it("should default to asc if sortOrder is invalid", async () => {
        mockRoomRepo.count.mockResolvedValue(1);
        mockRoomRepo.findAll.mockResolvedValue(mockRooms);

        await roomService.getAllRooms({
          sortBy: "capacity",
          sortOrder: "invalid",
        });

        expect(mockRoomRepo.findAll).toHaveBeenCalledWith(
          undefined,
          { capacity: "asc" },
          10,
          0,
        );
      });

      it("should ignore invalid sortBy fields", async () => {
        mockRoomRepo.count.mockResolvedValue(1);
        mockRoomRepo.findAll.mockResolvedValue(mockRooms);

        await roomService.getAllRooms({ sortBy: "invalidField" });

        expect(mockRoomRepo.findAll).toHaveBeenCalledWith(
          undefined,
          undefined,
          10,
          0,
        );
      });
    });

    describe("Pagination", () => {
      it("should use default pagination (limit: 10, offset: 0)", async () => {
        mockRoomRepo.count.mockResolvedValue(50);
        mockRoomRepo.findAll.mockResolvedValue(mockRooms);

        const result = await roomService.getAllRooms({});

        expect(mockRoomRepo.findAll).toHaveBeenCalledWith(
          undefined,
          undefined,
          10,
          0,
        );
        expect(result.pagination).toEqual({
          total: 50,
          limit: 10,
          offset: 0,
          hasMore: true,
        });
      });

      it("should apply custom limit", async () => {
        mockRoomRepo.count.mockResolvedValue(50);
        mockRoomRepo.findAll.mockResolvedValue(mockRooms);

        await roomService.getAllRooms({ limit: 20 });

        expect(mockRoomRepo.findAll).toHaveBeenCalledWith(
          undefined,
          undefined,
          20,
          0,
        );
      });

      it("should apply custom offset", async () => {
        mockRoomRepo.count.mockResolvedValue(50);
        mockRoomRepo.findAll.mockResolvedValue(mockRooms);

        await roomService.getAllRooms({ offset: 10 });

        expect(mockRoomRepo.findAll).toHaveBeenCalledWith(
          undefined,
          undefined,
          10,
          10,
        );
      });

      it("should cap limit at 100", async () => {
        mockRoomRepo.count.mockResolvedValue(200);
        mockRoomRepo.findAll.mockResolvedValue(mockRooms);

        await roomService.getAllRooms({ limit: 150 });

        expect(mockRoomRepo.findAll).toHaveBeenCalledWith(
          undefined,
          undefined,
          10, // Falls back to default because it exceeds 100
          0,
        );
      });

      it("should calculate hasMore correctly when there are more items", async () => {
        mockRoomRepo.count.mockResolvedValue(25);
        mockRoomRepo.findAll.mockResolvedValue(mockRooms);

        const result = await roomService.getAllRooms({ limit: 10, offset: 0 });

        expect(result.pagination.hasMore).toBe(true);
      });

      it("should calculate hasMore correctly when no more items", async () => {
        mockRoomRepo.count.mockResolvedValue(10);
        mockRoomRepo.findAll.mockResolvedValue(mockRooms);

        const result = await roomService.getAllRooms({ limit: 10, offset: 0 });

        expect(result.pagination.hasMore).toBe(false);
      });
    });

    describe("Response Format", () => {
      it("should return rooms with pagination and filters", async () => {
        mockRoomRepo.count.mockResolvedValue(1);
        mockRoomRepo.findAll.mockResolvedValue(mockRooms);

        const result = await roomService.getAllRooms({
          search: "Conference",
          buildingId: "b-001",
          limit: 10,
          offset: 0,
        });

        expect(result.pagination).toEqual({
            total: 1,
            limit: 10,
            offset: 0,
            hasMore: false,
        });
        expect(result.filters).toEqual({
            search: "Conference",
            buildingId: "b-001",
            roomType: null,
            status: null,
            minPrice: null,
            maxPrice: null,
            minCapacity: null,
            sortBy: null,
            sortOrder: null,
        });
        expect(result.rooms[0]).toEqual(expect.objectContaining(mockRooms[0]));
      });
    });
  });

  describe("updateRoom()", () => {
    const updateData = {
      name: "Updated Room Name",
      description: "Updated description",
      pricePerHour: 75,
      securityDeposit: 150,
      capacity: 25,
      roomType: "EVENT" as const,
      area: 60,
      isAvailable: false,
    };

    describe("Validation", () => {
      it("should throw BadRequestError if roomId is missing", async () => {
        await expect(roomService.updateRoom("", updateData)).rejects.toThrow(
          BadRequestError,
        );

        await expect(roomService.updateRoom("", updateData)).rejects.toThrow(
          "Room ID is required",
        );
      });

      it("should throw NotFoundError if room not found", async () => {
        mockRoomRepo.findById.mockResolvedValue(null);

        await expect(
          roomService.updateRoom("non-existent", updateData),
        ).rejects.toThrow(NotFoundError);

        await expect(
          roomService.updateRoom("non-existent", updateData),
        ).rejects.toThrow("Room not found");

        expect(mockRoomRepo.findById).toHaveBeenCalledWith("non-existent");
      });

      it("should throw BadRequestError if name is empty string", async () => {
        mockRoomRepo.findById.mockResolvedValue(mockRoom);

        await expect(
          roomService.updateRoom("r-001", { name: "" }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          roomService.updateRoom("r-001", { name: "" }),
        ).rejects.toThrow("Room name cannot be empty");
      });

      it("should throw BadRequestError if name is only whitespace", async () => {
        mockRoomRepo.findById.mockResolvedValue(mockRoom);

        await expect(
          roomService.updateRoom("r-001", { name: "   " }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          roomService.updateRoom("r-001", { name: "   " }),
        ).rejects.toThrow("Room name cannot be empty");
      });

      it("should throw BadRequestError if pricePerHour is 0", async () => {
        mockRoomRepo.findById.mockResolvedValue(mockRoom);

        await expect(
          roomService.updateRoom("r-001", { pricePerHour: 0 }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          roomService.updateRoom("r-001", { pricePerHour: 0 }),
        ).rejects.toThrow("Price per hour must be greater than 0");
      });

      it("should throw BadRequestError if pricePerHour is negative", async () => {
        mockRoomRepo.findById.mockResolvedValue(mockRoom);

        await expect(
          roomService.updateRoom("r-001", { pricePerHour: -50 }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          roomService.updateRoom("r-001", { pricePerHour: -50 }),
        ).rejects.toThrow("Price per hour must be greater than 0");
      });

      it("should throw BadRequestError if capacity is 0", async () => {
        mockRoomRepo.findById.mockResolvedValue(mockRoom);

        await expect(
          roomService.updateRoom("r-001", { capacity: 0 }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          roomService.updateRoom("r-001", { capacity: 0 }),
        ).rejects.toThrow("Capacity must be greater than 0");
      });

      it("should throw BadRequestError if capacity is negative", async () => {
        mockRoomRepo.findById.mockResolvedValue(mockRoom);

        await expect(
          roomService.updateRoom("r-001", { capacity: -10 }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          roomService.updateRoom("r-001", { capacity: -10 }),
        ).rejects.toThrow("Capacity must be greater than 0");
      });
    });

    describe("Success", () => {
      it("should update room successfully with all fields", async () => {
        const updatedRoom = { ...mockRoom, ...updateData };
        mockRoomRepo.findById.mockResolvedValue(mockRoom);
        mockRoomRepo.update.mockResolvedValue(updatedRoom);

        const result = await roomService.updateRoom("r-001", updateData);

        expect(result).toEqual({ room: updatedRoom });
        expect(mockRoomRepo.update).toHaveBeenCalledWith("r-001", updateData);
      });

      it("should update room successfully with partial fields", async () => {
        const partialUpdate = { name: "New Name", capacity: 30 };
        const updatedRoom = { ...mockRoom, ...partialUpdate };
        mockRoomRepo.findById.mockResolvedValue(mockRoom);
        mockRoomRepo.update.mockResolvedValue(updatedRoom);

        const result = await roomService.updateRoom("r-001", partialUpdate);

        expect(result).toEqual({ room: updatedRoom });
        expect(mockRoomRepo.update).toHaveBeenCalledWith(
          "r-001",
          partialUpdate,
        );
      });

      it("should update room status", async () => {
        const updatedRoom = { ...mockRoom, status: "MAINTAIN" as const };
        mockRoomRepo.findById.mockResolvedValue(mockRoom);
        mockRoomRepo.update.mockResolvedValue(updatedRoom);

        const result = await roomService.updateRoom("r-001", {
          status: "MAINTAIN",
        });

        expect(result.room).toEqual(updatedRoom);
        expect(mockRoomRepo.update).toHaveBeenCalledWith("r-001", {
          status: "MAINTAIN",
        });
      });
    });
  });

  describe("deleteRoom()", () => {
    it("should throw BadRequestError if roomId is missing", async () => {
      await expect(roomService.deleteRoom("")).rejects.toThrow(BadRequestError);

      await expect(roomService.deleteRoom("")).rejects.toThrow(
        "Room ID is required",
      );
    });

    it("should throw NotFoundError if room not found", async () => {
      mockRoomRepo.findById.mockResolvedValue(null);

      await expect(roomService.deleteRoom("non-existent")).rejects.toThrow(
        NotFoundError,
      );

      await expect(roomService.deleteRoom("non-existent")).rejects.toThrow(
        "Room not found",
      );

      expect(mockRoomRepo.findById).toHaveBeenCalledWith("non-existent");
    });

    it("should delete room successfully", async () => {
      mockRoomRepo.findById.mockResolvedValue(mockRoom);
      mockRoomRepo.delete.mockResolvedValue(mockRoom);

      const result = await roomService.deleteRoom("r-001");

      expect(result).toEqual({ room: mockRoom });
      expect(mockRoomRepo.delete).toHaveBeenCalledWith("r-001");
    });
  });

  describe("searchAvailableRooms()", () => {
    const validSearch = {
      startTime: "2026-03-27T09:00:00.000Z",
      endTime: "2026-03-27T11:00:00.000Z",
    };

    it("should throw BadRequestError if startTime is missing", async () => {
      await expect(
        roomService.searchAvailableRooms({ endTime: validSearch.endTime }),
      ).rejects.toThrow(BadRequestError);
    });

    it("should throw BadRequestError if endTime is missing", async () => {
      await expect(
        roomService.searchAvailableRooms({ startTime: validSearch.startTime }),
      ).rejects.toThrow(BadRequestError);
    });

    it("should throw BadRequestError if startTime >= endTime", async () => {
      await expect(
        roomService.searchAvailableRooms({
          startTime: "2026-03-27T11:00:00.000Z",
          endTime: "2026-03-27T09:00:00.000Z",
        }),
      ).rejects.toThrow(BadRequestError);
    });

    it("should call findAll with correct filters", async () => {
      mockRoomRepo.count.mockResolvedValue(1);
      mockRoomRepo.findAll.mockResolvedValue([mockRoom]);

      await roomService.searchAvailableRooms(validSearch);

      expect(mockRoomRepo.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "AVAILABLE",
          bookings: {
            none: expect.objectContaining({
              status: { in: ["APPROVED", "PENDING"] },
            }),
          },
        }),
        expect.any(Object),
        10,
        0,
      );
    });
  });

  describe('Peak Hour Pricing', () => {
    // Vietnam time is UTC+7
    // Peak hour: >= 18:00 VN = >= 11:00 UTC
    // Off-peak: < 18:00 VN = < 11:00 UTC

    describe('applyPeakPricing via getRoomById()', () => {
      it('should NOT apply surcharge before 18:00 Vietnam time (17:59 VN = 10:59 UTC)', async () => {
        jest
          .spyOn(Date, 'now')
          .mockReturnValue(new Date('2026-01-01T10:59:00Z').getTime());
        mockRoomRepo.findById.mockResolvedValue(mockRoom);

        const result = await roomService.getRoomById('r-001');

        expect(result.room.isPeakHour).toBe(false);
        expect(result.room.pricePerHour).toBe(50);
        expect(result.room.originalPricePerHour).toBe(50);
      });

      it('should apply +20% surcharge at exactly 18:00 Vietnam time (11:00 UTC)', async () => {
        jest
          .spyOn(Date, 'now')
          .mockReturnValue(new Date('2026-01-01T11:00:00Z').getTime());
        mockRoomRepo.findById.mockResolvedValue(mockRoom);

        const result = await roomService.getRoomById('r-001');

        expect(result.room.isPeakHour).toBe(true);
        expect(result.room.pricePerHour).toBe(60); // 50 * 1.2 = 60
        expect(result.room.originalPricePerHour).toBe(50);
      });

      it('should apply +20% surcharge at 19:00 Vietnam time (12:00 UTC)', async () => {
        jest
          .spyOn(Date, 'now')
          .mockReturnValue(new Date('2026-01-01T12:00:00Z').getTime());
        mockRoomRepo.findById.mockResolvedValue(mockRoom);

        const result = await roomService.getRoomById('r-001');

        expect(result.room.isPeakHour).toBe(true);
        expect(result.room.pricePerHour).toBe(60);
        expect(result.room.originalPricePerHour).toBe(50);
      });

      it('should round peak price to 2 decimal places', async () => {
        jest
          .spyOn(Date, 'now')
          .mockReturnValue(new Date('2026-01-01T12:00:00Z').getTime());
        const roomWithDecimalPrice = { ...mockRoom, pricePerHour: 33.33 };
        mockRoomRepo.findById.mockResolvedValue(roomWithDecimalPrice);

        const result = await roomService.getRoomById('r-001');

        // 33.33 * 1.2 = 39.996 → rounded to 40.00
        expect(result.room.pricePerHour).toBe(40);
        expect(result.room.originalPricePerHour).toBe(33.33);
        expect(result.room.isPeakHour).toBe(true);
      });

      it('should always preserve originalPricePerHour as the stored price', async () => {
        jest
          .spyOn(Date, 'now')
          .mockReturnValue(new Date('2026-01-01T12:00:00Z').getTime());
        mockRoomRepo.findById.mockResolvedValue(mockRoom);

        const result = await roomService.getRoomById('r-001');

        expect(result.room.originalPricePerHour).toBe(mockRoom.pricePerHour);
        expect(result.room.pricePerHour).not.toBe(mockRoom.pricePerHour);
      });
    });

    describe('applyPeakPricing via getAllRooms()', () => {
      it('should apply peak pricing to all rooms when peak hour', async () => {
        jest
          .spyOn(Date, 'now')
          .mockReturnValue(new Date('2026-01-01T12:00:00Z').getTime());
        const multipleRooms = [
          { ...mockRoom, id: 'r-001', pricePerHour: 50 },
          { ...mockRoom, id: 'r-002', pricePerHour: 100 },
        ];
        mockRoomRepo.count.mockResolvedValue(2);
        mockRoomRepo.findAll.mockResolvedValue(multipleRooms);

        const result = await roomService.getAllRooms({});

        expect(result.rooms[0].isPeakHour).toBe(true);
        expect(result.rooms[0].pricePerHour).toBe(60); // 50 * 1.2
        expect(result.rooms[0].originalPricePerHour).toBe(50);
        expect(result.rooms[1].isPeakHour).toBe(true);
        expect(result.rooms[1].pricePerHour).toBe(120); // 100 * 1.2
        expect(result.rooms[1].originalPricePerHour).toBe(100);
      });

      it('should NOT apply peak pricing when off-peak', async () => {
        jest
          .spyOn(Date, 'now')
          .mockReturnValue(new Date('2026-01-01T03:00:00Z').getTime());
        mockRoomRepo.count.mockResolvedValue(1);
        mockRoomRepo.findAll.mockResolvedValue([mockRoom]);

        const result = await roomService.getAllRooms({});

        expect(result.rooms[0].isPeakHour).toBe(false);
        expect(result.rooms[0].pricePerHour).toBe(mockRoom.pricePerHour);
        expect(result.rooms[0].originalPricePerHour).toBe(
          mockRoom.pricePerHour,
        );
      });

      it('should return empty rooms array without error during peak hours', async () => {
        jest
          .spyOn(Date, 'now')
          .mockReturnValue(new Date('2026-01-01T12:00:00Z').getTime());
        mockRoomRepo.count.mockResolvedValue(0);
        mockRoomRepo.findAll.mockResolvedValue([]);

        const result = await roomService.getAllRooms({});

        expect(result.rooms).toEqual([]);
        expect(result.pagination.total).toBe(0);
      });
    });
  });
});
