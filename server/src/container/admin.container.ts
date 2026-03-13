import AdminController from "../controllers/admin.controller";
import { ManagerRepository } from "../repository/manager.repository";
import { UserRepository } from "../repository/user.repository";
import AdminService from "../services/admin.service";

const userRepo = new UserRepository();
const managerRepo = new ManagerRepository();

const adminService = new AdminService(userRepo, managerRepo);

export const adminController = new AdminController(adminService);
