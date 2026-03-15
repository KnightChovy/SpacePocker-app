import { IServiceCategoryRepository } from "../interface/serviceCategory.repository.interface";
import { IRoomRepository } from "../interface/room.repository.interface";
import {
  BadRequestError,
  NotFoundError,
  ConflictRequestError,
} from "../core/error.response";

export default class ServiceCategoryService {
  constructor(
    private serviceCategoryRepo: IServiceCategoryRepository,
    private roomRepo: IRoomRepository,
  ) {}

  async createServiceCategory(data: {
    name: string;
    description?: string;
    managerId: string;
  }) {
    const { name, description, managerId } = data;

    if (!name || name.trim().length === 0) {
      throw new BadRequestError("Service category name is required");
    }

    if (!managerId || managerId.trim().length === 0) {
      throw new BadRequestError("Manager ID is required");
    }

    const existing = await this.serviceCategoryRepo.findByName(name);
    if (existing) {
      throw new ConflictRequestError(
        "Service category with this name already exists",
      );
    }

    return this.serviceCategoryRepo.create({
      name: name.trim(),
      description: description?.trim(),
      managerId,
    });
  }

  async getAllServiceCategories() {
    return this.serviceCategoryRepo.findAll();
  }

  async getServiceCategoryById(id: string) {
    const category = await this.serviceCategoryRepo.findById(id);
    if (!category) {
      throw new NotFoundError("Service category not found");
    }
    return category;
  }

  async updateServiceCategory(
    id: string,
    data: {
      name?: string;
      description?: string;
    },
  ) {
    const { name, description } = data;

    // Check if service category exists
    const category = await this.serviceCategoryRepo.findById(id);
    if (!category) {
      throw new NotFoundError("Service category not found");
    }

    if (name !== undefined && name.trim().length === 0) {
      throw new BadRequestError("Service category name cannot be empty");
    }

    // Check if another category with same name exists
    if (name) {
      const existing = await this.serviceCategoryRepo.findByName(name);
      if (existing && existing.id !== id) {
        throw new ConflictRequestError(
          "Service category with this name already exists",
        );
      }
    }

    return this.serviceCategoryRepo.update(id, {
      ...(name !== undefined && { name: name.trim() }),
      ...(description !== undefined && { description: description.trim() }),
    });
  }

  async deleteServiceCategory(id: string) {
    // Check if service category exists
    const category = await this.serviceCategoryRepo.findById(id);
    if (!category) {
      throw new NotFoundError("Service category not found");
    }

    return this.serviceCategoryRepo.delete(id);
  }

  async addRoomServiceCategory(data: { roomId: string; categoryId: string }) {
    const { roomId, categoryId } = data;

    if (!roomId || !categoryId) {
      throw new BadRequestError("Room ID and Category ID are required");
    }

    // Check if room exists
    const room = await this.roomRepo.findById(roomId);
    if (!room) {
      throw new NotFoundError("Room not found");
    }

    // Check if category exists
    const category = await this.serviceCategoryRepo.findById(categoryId);
    if (!category) {
      throw new NotFoundError("Service category not found");
    }

    // Check if relationship already exists
    const existing = await this.serviceCategoryRepo.findRoomServiceCategory(
      roomId,
      categoryId,
    );
    if (existing) {
      throw new ConflictRequestError(
        "This service category is already assigned to the room",
      );
    }

    return this.serviceCategoryRepo.addRoomServiceCategory({
      roomId,
      categoryId,
    });
  }

  async removeRoomServiceCategory(roomId: string, categoryId: string) {
    if (!roomId || !categoryId) {
      throw new BadRequestError("Room ID and Category ID are required");
    }

    // Check if relationship exists
    const existing = await this.serviceCategoryRepo.findRoomServiceCategory(
      roomId,
      categoryId,
    );
    if (!existing) {
      throw new NotFoundError("Service category is not assigned to this room");
    }

    return this.serviceCategoryRepo.removeRoomServiceCategory(
      roomId,
      categoryId,
    );
  }
}
