import { NextFunction, Request, Response } from "express";
import { OK } from "../core/success.response";
import AdminService from "../services/admin.service";

class AdminController {
  constructor(private adminService: AdminService) {}

  promoteUserToManager = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const result = await this.adminService.promoteUserToManager(
      String(req.params.userId),
    );

    new OK({
      message: result.message,
      metadata: {},
    }).send(res);
  };
}

export default AdminController;
