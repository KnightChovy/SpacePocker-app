import AdminService from "../admin.service";
import { BadRequestError, NotFoundError } from "../../core/error.response";

describe("AdminService", () => {
  let adminService: AdminService;
  let userRepo: any;
  let managerRepo: any;

  beforeEach(() => {
    userRepo = {
      findById: jest.fn(),
      updateRole: jest.fn(),
    };
    managerRepo = {
      findByUserIdentity: jest.fn(),
      createFromUser: jest.fn(),
    };

    adminService = new AdminService(userRepo, managerRepo);
    jest.clearAllMocks();
  });

  it("should throw BadRequestError when userId is empty", async () => {
    await expect(adminService.promoteUserToManager("")).rejects.toThrow(
      BadRequestError,
    );
  });

  it("should throw NotFoundError when user does not exist", async () => {
    userRepo.findById.mockResolvedValue(null);

    await expect(adminService.promoteUserToManager("user-1")).rejects.toThrow(
      NotFoundError,
    );
  });

  it("should throw BadRequestError when user is already manager", async () => {
    userRepo.findById.mockResolvedValue({
      id: "user-1",
      email: "user1@example.com",
      role: "MANAGER",
    });

    await expect(adminService.promoteUserToManager("user-1")).rejects.toThrow(
      BadRequestError,
    );
  });

  it("should update role and create manager if manager profile does not exist", async () => {
    const user = {
      id: "user-1",
      name: "User One",
      email: "user1@example.com",
      phoneNumber: "0900000000",
      role: "USER",
    };
    userRepo.findById.mockResolvedValue(user);
    managerRepo.findByUserIdentity.mockResolvedValue(null);

    const result = await adminService.promoteUserToManager("user-1");

    expect(userRepo.updateRole).toHaveBeenCalledWith("user-1", "MANAGER");
    expect(managerRepo.findByUserIdentity).toHaveBeenCalledWith(
      "user-1",
      "user1@example.com",
    );
    expect(managerRepo.createFromUser).toHaveBeenCalledWith(user);
    expect(result).toEqual({
      message: "User promoted to manager successfully",
    });
  });

  it("should update role and skip manager creation if manager profile already exists", async () => {
    const user = {
      id: "user-1",
      name: "User One",
      email: "user1@example.com",
      phoneNumber: null,
      role: "USER",
    };
    userRepo.findById.mockResolvedValue(user);
    managerRepo.findByUserIdentity.mockResolvedValue({ id: "user-1" });

    await adminService.promoteUserToManager("user-1");

    expect(userRepo.updateRole).toHaveBeenCalledWith("user-1", "MANAGER");
    expect(managerRepo.createFromUser).not.toHaveBeenCalled();
  });
});
