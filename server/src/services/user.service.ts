import { IUserRepository } from "../interface/user.repository.interface";
import { BadRequestError, NotFoundError } from "../core/error.response";
import bcrypt from "bcrypt";

export default class UserService {
  constructor(private userRepo: IUserRepository) {}

  async getUserProfile(userId: string) {
    if (!userId) {
      throw new BadRequestError("User ID is required");
    }

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  async getUsers(params: {
    search?: string;
    role?: string;
    page?: number;
    limit?: number;
  }) {
    const { search, role, page = 1, limit = 10 } = params;

    const skip = (page - 1) * limit;
    const take = limit;

    const filter: any = {};
    if (search) {
      filter.search = search;
    }
    if (role) {
      filter.role = role;
    }

    const [users, total] = await Promise.all([
      this.userRepo.findMany(filter, { skip, take }),
      this.userRepo.count(filter),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateUserProfile(
    userId: string,
    data: { name?: string; phoneNumber?: string | null },
  ) {
    if (!userId) {
      throw new BadRequestError("User ID is required");
    }

    const hasName = data.name !== undefined;
    const hasPhoneNumber = data.phoneNumber !== undefined;
    if (!hasName && !hasPhoneNumber) {
      throw new BadRequestError("No profile data provided for update");
    }

    if (hasName && (!data.name || data.name.trim() === "")) {
      throw new BadRequestError("Name cannot be empty");
    }

    const existingUser = await this.userRepo.findById(userId);
    if (!existingUser) {
      throw new NotFoundError("User not found");
    }

    return this.userRepo.updateProfile(userId, {
      name: data.name?.trim(),
      phoneNumber: data.phoneNumber,
    });
  }

  async changePassword(
    userId: string,
    data: {
      currentPassword: string;
      newPassword: string;
      confirmNewPassword: string;
    },
  ) {
    if (!userId) {
      throw new BadRequestError("User ID is required");
    }

    const { currentPassword, newPassword, confirmNewPassword } = data;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      throw new BadRequestError("currentPassword, newPassword and confirmNewPassword are required");
    }

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestError("New password and confirm password do not match");
    }

    if (currentPassword === newPassword) {
      throw new BadRequestError("New password must be different from current password");
    }

    const user = await this.userRepo.findByIdWithPassword(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestError("Current password is incorrect");
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.userRepo.updatePassword(userId, passwordHash);

    return {
      userId,
      changed: true,
    };
  }
}
