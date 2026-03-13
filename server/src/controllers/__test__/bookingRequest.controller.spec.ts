import { Request, Response } from "express";
import BookingRequestController from "../bookingRequest.controller";

describe("BookingRequestController", () => {
  const bookingRequestServiceMock: any = {
    createBookingRequest: jest.fn(),
    getBookingRequestById: jest.fn(),
    getBookingRequestsForManager: jest.fn(),
    approveBookingRequest: jest.fn(),
    rejectBookingRequest: jest.fn(),
  };

  const controller = new BookingRequestController(bookingRequestServiceMock);

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

  it("should call service approveBookingRequest and return 200", async () => {
    const req = {
      params: { id: "br-1" },
      user: { userId: "manager-1", email: "manager@example.com" },
    } as unknown as Request;
    const res = createMockResponse();

    bookingRequestServiceMock.approveBookingRequest.mockResolvedValue({
      bookingRequest: { id: "br-1", status: "APPROVED" },
      booking: { id: "b-1", status: "APPROVED" },
    });

    await controller.approveBookingRequest(req, res, jest.fn());

    expect(
      bookingRequestServiceMock.approveBookingRequest,
    ).toHaveBeenCalledWith("br-1", "manager-1", "manager@example.com");
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should call service rejectBookingRequest and return 200", async () => {
    const req = {
      params: { id: "br-2" },
      user: { userId: "manager-1", email: "manager@example.com" },
    } as unknown as Request;
    const res = createMockResponse();

    bookingRequestServiceMock.rejectBookingRequest.mockResolvedValue({
      id: "br-2",
      status: "REJECTED",
    });

    await controller.rejectBookingRequest(req, res, jest.fn());

    expect(bookingRequestServiceMock.rejectBookingRequest).toHaveBeenCalledWith(
      "br-2",
      "manager-1",
      "manager@example.com",
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should default status to PENDING for manager list", async () => {
    const req = {
      query: {},
      user: { userId: "manager-1", email: "manager@example.com" },
    } as unknown as Request;
    const res = createMockResponse();

    bookingRequestServiceMock.getBookingRequestsForManager.mockResolvedValue(
      [],
    );

    await controller.getBookingRequestsForManager(req, res, jest.fn());

    expect(
      bookingRequestServiceMock.getBookingRequestsForManager,
    ).toHaveBeenCalledWith("manager-1", "manager@example.com", "PENDING");
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
