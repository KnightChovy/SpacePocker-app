import { IUserRepository } from "../interface/user.repository.interface";
import { BadRequestError, NotFoundError } from "../core/error.response";

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
}
