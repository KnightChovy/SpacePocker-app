import AccessService from "../services/access.service";
import { OK, Created, SuccessResponse } from "../core/success.response";
import { NextFunction, Request, Response } from "express";

class AccessController {
  constructor(private accessService: AccessService) {}
  handleRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new OK({
      message: "Token refreshed successfully",
      metadata: await this.accessService.handleRefreshToken(req.body),
    }).send(res);
  };
  logout = async (req: Request, res: Response, next: NextFunction) => {
    new OK({
      message: "User logged out successfully",
      metadata: await this.accessService.logout(req.body),
    }).send(res);
  };

  signUp = async (req: Request, res: Response, next: NextFunction) => {
    new Created({
      message: "User created successfully",
      metadata: await this.accessService.signUp(req.body),
    }).send(res);
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    new OK({
      message: "User logged in successfully",
      metadata: await this.accessService.login(req.body),
    }).send(res);
  };
}

export default AccessController;
