import { Request, Response } from "express";
import BookingController from "../booking.controller";

describe("BookingController", () => {
  const bookingServiceMock: any = {
    getAllBookings: jest.fn(),
    getMyBookings: jest.fn(),
    updateBooking: jest.fn(),
    cancelBooking: jest.fn(),
    managerCancelPaidBookingAndNotifyRefund: jest.fn(),
  };

  const controller = new BookingController(bookingServiceMock);

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

  it("should call service getAllBookings and return 200", async () => {
    const req = {
      query: { limit: "10", offset: "0" },
    } as unknown as Request;
    const res = createMockResponse();

    bookingServiceMock.getAllBookings.mockResolvedValue({ bookings: [] });

    await controller.getAllBookings(req, res, jest.fn());

    expect(bookingServiceMock.getAllBookings).toHaveBeenCalledWith(req.query);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should call service getMyBookings and return 200", async () => {
    const req = {
      user: {
        userId: "user-1",
      },
    } as unknown as Request;
    const res = createMockResponse();

    bookingServiceMock.getMyBookings.mockResolvedValue({
      bookings: [{ id: "booking-1" }],
    });

    await controller.getMyBookings(req, res, jest.fn());

    expect(bookingServiceMock.getMyBookings).toHaveBeenCalledWith("user-1");
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should call service updateBooking and return 200", async () => {
    const req = {
      params: { id: "booking-1" },
      body: { purpose: "Updated meeting" },
    } as unknown as Request;
    const res = createMockResponse();

    bookingServiceMock.updateBooking.mockResolvedValue({
      booking: { id: "booking-1", purpose: "Updated meeting" },
    });

    await controller.updateBooking(req, res, jest.fn());

    expect(bookingServiceMock.updateBooking).toHaveBeenCalledWith(
      "booking-1",
      req.body,
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should call service cancelBooking and return 200", async () => {
    const req = {
      params: { id: "booking-1" },
      user: {
        userId: "user-1",
        role: "USER",
      },
    } as unknown as Request;
    const res = createMockResponse();

    bookingServiceMock.cancelBooking.mockResolvedValue({
      booking: { id: "booking-1" },
    });

    await controller.cancelBooking(req, res, jest.fn());

    expect(bookingServiceMock.cancelBooking).toHaveBeenCalledWith(
      "booking-1",
      "user-1",
      "USER",
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should call service managerCancelPaidBookingAndNotifyRefund and return 200", async () => {
    const req = {
      params: { id: "booking-request-1" },
      body: { reason: "Room maintenance" },
      user: {
        userId: "manager-1",
        role: "MANAGER",
      },
    } as unknown as Request;
    const res = createMockResponse();

    bookingServiceMock.managerCancelPaidBookingAndNotifyRefund.mockResolvedValue({
      bookingRequest: { id: "booking-request-1", status: "CANCELLED" },
      booking: { id: "booking-1", status: "CANCELLED" },
      refund: { amount: 100000, reason: "Room maintenance", status: "SUCCESS" },
    });

    await controller.managerCancelPaidBookingAndNotifyRefund(
      req,
      res,
      jest.fn(),
    );

    expect(
      bookingServiceMock.managerCancelPaidBookingAndNotifyRefund,
    ).toHaveBeenCalledWith(
      "booking-request-1",
      "manager-1",
      "MANAGER",
      "Room maintenance",
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
