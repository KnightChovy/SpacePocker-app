import { Request, Response, NextFunction } from "express";
import UserService from "../services/user.service";
import { OK } from "../core/success.response";

class UserController {
  constructor(private userService: UserService) {}

  updateUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    new OK({
      message: "Update user profile successfully",
      metadata: await this.userService.updateUserProfile(
        String(req.user?.userId),
        req.body,
      ),
    }).send(res);
  };

  getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    new OK({
      message: "Get user profile successfully",
      metadata: await this.userService.getUserProfile(String(req.user?.userId)),
    }).send(res);
  };

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    const { search, role, page, limit } = req.query;

    new OK({
      message: "Get users successfully",
      metadata: await this.userService.getUsers({
        search: search ? String(search) : undefined,
        role: role ? String(role) : undefined,
        page: page ? parseInt(String(page)) : undefined,
        limit: limit ? parseInt(String(limit)) : undefined,
      }),
    }).send(res);
  };

  changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    new OK({
      message: "Change password successfully",
      metadata: await this.userService.changePassword(
        String(req.user?.userId),
        req.body,
      ),
    }).send(res);
  };
}

export default UserController;
