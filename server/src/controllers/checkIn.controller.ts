import { Request, Response, NextFunction } from "express";
import { OK } from "../core/success.response";
import CheckInService from "../services/checkIn.service";
import { CheckInMethod } from "@prisma/client";

class CheckInController {
  constructor(private checkInService: CheckInService) {}

  checkIn = async (req: Request, res: Response, next: NextFunction) => {
    const bookingRequestId = String(req.params.id);
    const userId = String(req.user?.userId);
    const userRole = String(req.user?.role);
    const { method, note } = req.body || {};

    const validMethods: CheckInMethod[] = ["QR_CODE", "MANUAL", "PIN_CODE"];
    const parsedMethod: CheckInMethod =
      method && validMethods.includes(method as CheckInMethod)
        ? (method as CheckInMethod)
        : "MANUAL";

    new OK({
      message: "Check-in successful",
      metadata: await this.checkInService.checkIn(
        bookingRequestId,
        userId,
        userRole,
        parsedMethod,
        typeof note === "string" ? note : undefined,
      ),
    }).send(res);
  };

  checkOut = async (req: Request, res: Response, next: NextFunction) => {
    const bookingRequestId = String(req.params.id);
    const userId = String(req.user?.userId);
    const userRole = String(req.user?.role);
    const { note } = req.body || {};

    new OK({
      message: "Check-out successful",
      metadata: await this.checkInService.checkOut(
        bookingRequestId,
        userId,
        userRole,
        typeof note === "string" ? note : undefined,
      ),
    }).send(res);
  };

  getCheckInStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    new OK({
      message: "Check-in status retrieved successfully",
      metadata: await this.checkInService.getCheckInStatus(
        String(req.params.id),
        String(req.user?.userId),
        String(req.user?.role),
      ),
    }).send(res);
  };
}

export default CheckInController;
