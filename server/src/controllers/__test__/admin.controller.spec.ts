import { Request, Response } from "express";
import AdminController from "../admin.controller";

describe("AdminController", () => {
  const adminServiceMock: any = {
    promoteUserToManager: jest.fn(),
  };

  const controller = new AdminController(adminServiceMock);

  const createMockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.set = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call service and return success response", async () => {
    const req = {
      params: { userId: "user-1" },
    } as unknown as Request;
    const res = createMockResponse();

    adminServiceMock.promoteUserToManager.mockResolvedValue({
      message: "User promoted to manager successfully",
    });

    await controller.promoteUserToManager(req, res, jest.fn());

    expect(adminServiceMock.promoteUserToManager).toHaveBeenCalledWith(
      "user-1",
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "User promoted to manager successfully",
      }),
    );
  });
});
