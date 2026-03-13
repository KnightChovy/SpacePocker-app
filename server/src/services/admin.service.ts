import { BadRequestError, NotFoundError } from "../core/error.response";
import { IUserRepository } from "../interface/user.repository.interface";
import { IManagerRepository } from "../interface/manager.repository.interface";

export default class AdminService {
  constructor(
    private userRepo: IUserRepository,
    private managerRepo: IManagerRepository,
  ) {}

  async promoteUserToManager(userId: string) {
    if (!userId || typeof userId !== "string" || userId.trim() === "") {
      throw new BadRequestError("userId is required");
    }

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.role === "MANAGER") {
      throw new BadRequestError("User is already a manager");
    }

    await this.userRepo.updateRole(user.id, "MANAGER");

    const existingManager = await this.managerRepo.findByUserIdentity(
      user.id,
      user.email,
    );

    if (!existingManager) {
      await this.managerRepo.createFromUser(user);
    }

    return { message: "User promoted to manager successfully" };
  }
}
