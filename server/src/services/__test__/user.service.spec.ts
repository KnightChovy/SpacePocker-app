import UserService from "../user.service";
import { IUserRepository } from "../../interface/user.repository.interface";
import { BadRequestError, NotFoundError } from "../../core/error.response";

describe("UserService", () => {
  let userService: UserService;
  let mockUserRepo: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepo = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      updateProfile: jest.fn(),
      updateRole: jest.fn(),
      createUser: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    } as jest.Mocked<IUserRepository>;

    userService = new UserService(mockUserRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserProfile()", () => {
    it("should throw BadRequestError when userId is not provided", async () => {
      await expect(userService.getUserProfile("")).rejects.toThrow(
        BadRequestError,
      );
      await expect(userService.getUserProfile("")).rejects.toThrow(
        "User ID is required",
      );
    });

    it("should throw NotFoundError when user is not found", async () => {
      mockUserRepo.findById.mockResolvedValue(null);

      await expect(userService.getUserProfile("user123")).rejects.toThrow(
        NotFoundError,
      );
      await expect(userService.getUserProfile("user123")).rejects.toThrow(
        "User not found",
      );

      expect(mockUserRepo.findById).toHaveBeenCalledWith("user123");
    });

    it("should return user profile when user exists", async () => {
      const mockUser = {
        id: "user123",
        name: "John Doe",
        email: "john@example.com",
        phoneNumber: "1234567890",
        role: "USER" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepo.findById.mockResolvedValue(mockUser);

      const result = await userService.getUserProfile("user123");

      expect(result).toEqual(mockUser);
      expect(mockUserRepo.findById).toHaveBeenCalledWith("user123");
    });
  });

  describe("getUsers()", () => {
    it("should return users with default pagination", async () => {
      const mockUsers = [
        {
          id: "user1",
          name: "User 1",
          email: "user1@example.com",
          phoneNumber: "1111111111",
          role: "USER" as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "user2",
          name: "User 2",
          email: "user2@example.com",
          phoneNumber: "2222222222",
          role: "MANAGER" as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockUserRepo.findMany.mockResolvedValue(mockUsers);
      mockUserRepo.count.mockResolvedValue(2);

      const result = await userService.getUsers({});

      expect(result).toEqual({
        users: mockUsers,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      });

      expect(mockUserRepo.findMany).toHaveBeenCalledWith(
        {},
        { skip: 0, take: 10 },
      );
      expect(mockUserRepo.count).toHaveBeenCalledWith({});
    });

    it("should return users with custom pagination", async () => {
      const mockUsers = [
        {
          id: "user3",
          name: "User 3",
          email: "user3@example.com",
          phoneNumber: "3333333333",
          role: "USER" as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockUserRepo.findMany.mockResolvedValue(mockUsers);
      mockUserRepo.count.mockResolvedValue(15);

      const result = await userService.getUsers({
        page: 2,
        limit: 5,
      });

      expect(result).toEqual({
        users: mockUsers,
        pagination: {
          page: 2,
          limit: 5,
          total: 15,
          totalPages: 3,
        },
      });

      expect(mockUserRepo.findMany).toHaveBeenCalledWith(
        {},
        { skip: 5, take: 5 },
      );
      expect(mockUserRepo.count).toHaveBeenCalledWith({});
    });

    it("should filter users by search query", async () => {
      const mockUsers = [
        {
          id: "user1",
          name: "John Doe",
          email: "john@example.com",
          phoneNumber: "1111111111",
          role: "USER" as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockUserRepo.findMany.mockResolvedValue(mockUsers);
      mockUserRepo.count.mockResolvedValue(1);

      const result = await userService.getUsers({
        search: "john",
      });

      expect(result.users).toEqual(mockUsers);
      expect(mockUserRepo.findMany).toHaveBeenCalledWith(
        { search: "john" },
        { skip: 0, take: 10 },
      );
      expect(mockUserRepo.count).toHaveBeenCalledWith({ search: "john" });
    });

    it("should filter users by role", async () => {
      const mockUsers = [
        {
          id: "admin1",
          name: "Admin User",
          email: "admin@example.com",
          phoneNumber: "9999999999",
          role: "ADMIN" as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockUserRepo.findMany.mockResolvedValue(mockUsers);
      mockUserRepo.count.mockResolvedValue(1);

      const result = await userService.getUsers({
        role: "ADMIN",
      });

      expect(result.users).toEqual(mockUsers);
      expect(mockUserRepo.findMany).toHaveBeenCalledWith(
        { role: "ADMIN" },
        { skip: 0, take: 10 },
      );
      expect(mockUserRepo.count).toHaveBeenCalledWith({ role: "ADMIN" });
    });

    it("should filter users by both search and role", async () => {
      const mockUsers = [
        {
          id: "manager1",
          name: "Jane Manager",
          email: "jane@example.com",
          phoneNumber: "8888888888",
          role: "MANAGER" as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockUserRepo.findMany.mockResolvedValue(mockUsers);
      mockUserRepo.count.mockResolvedValue(1);

      const result = await userService.getUsers({
        search: "jane",
        role: "MANAGER",
        page: 1,
        limit: 20,
      });

      expect(result).toEqual({
        users: mockUsers,
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          totalPages: 1,
        },
      });

      expect(mockUserRepo.findMany).toHaveBeenCalledWith(
        { search: "jane", role: "MANAGER" },
        { skip: 0, take: 20 },
      );
      expect(mockUserRepo.count).toHaveBeenCalledWith({
        search: "jane",
        role: "MANAGER",
      });
    });

    it("should return empty array when no users match the filter", async () => {
      mockUserRepo.findMany.mockResolvedValue([]);
      mockUserRepo.count.mockResolvedValue(0);

      const result = await userService.getUsers({
        search: "nonexistent",
      });

      expect(result).toEqual({
        users: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      });
    });
  });

  describe("updateUserProfile()", () => {
    it("should throw BadRequestError when userId is missing", async () => {
      await expect(
        userService.updateUserProfile("", { name: "New Name" }),
      ).rejects.toThrow(BadRequestError);
    });

    it("should throw BadRequestError when request body is empty", async () => {
      await expect(userService.updateUserProfile("user-1", {})).rejects.toThrow(
        BadRequestError,
      );
    });

    it("should throw NotFoundError when user does not exist", async () => {
      mockUserRepo.findById.mockResolvedValue(null);

      await expect(
        userService.updateUserProfile("user-1", { name: "New Name" }),
      ).rejects.toThrow(NotFoundError);
    });

    it("should update profile successfully", async () => {
      mockUserRepo.findById.mockResolvedValue({
        id: "user-1",
        name: "Old Name",
      });
      mockUserRepo.updateProfile.mockResolvedValue({
        id: "user-1",
        name: "New Name",
        email: "john@example.com",
        phoneNumber: "0123456789",
        role: "USER",
      });

      const result = await userService.updateUserProfile("user-1", {
        name: " New Name ",
        phoneNumber: "0123456789",
      });

      expect(mockUserRepo.updateProfile).toHaveBeenCalledWith("user-1", {
        name: "New Name",
        phoneNumber: "0123456789",
      });
      expect(result).toHaveProperty("name", "New Name");
    });
  });
});
