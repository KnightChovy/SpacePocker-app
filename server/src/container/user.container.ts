import { UserRepository } from "../repository/user.repository";
import UserService from "../services/user.service";
import UserController from "../controllers/user.controller";

const userRepo = new UserRepository();

const userService = new UserService(userRepo);

export const userController = new UserController(userService);
