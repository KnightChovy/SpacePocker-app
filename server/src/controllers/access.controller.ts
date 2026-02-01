import AccessService from "../services/access.service";
import { OK, Created, SuccessResponse } from "../core/success.response";
import { NextFunction, Request, Response } from "express";

class AccessController {
  static handleRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new OK({
      message: "Token refreshed successfully",
      metadata: await AccessService.handleRefreshToken(req.body),
    }).send(res);
  };
  static logout = async (req: Request, res: Response, next: NextFunction) => {
    new OK({
      message: "User logged out successfully",
      metadata: await AccessService.logout(req.body),
    }).send(res);
  };

  static signUp = async (req: Request, res: Response, next: NextFunction) => {
    new Created({
      message: "User created successfully",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };

  static login = async (req: Request, res: Response, next: NextFunction) => {
    new OK({
      message: "User logged in successfully",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };
}

export default AccessController;
