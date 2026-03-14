import { IServiceRepository } from "../interface/service.repository.interface";
import { IServiceCategoryRepository } from "../interface/serviceCategory.repository.interface";
import { BadRequestError, NotFoundError } from "../core/error.response";

export default class ServiceService {
  constructor(
    private serviceRepo: IServiceRepository,
    private serviceCategoryRepo: IServiceCategoryRepository,
  ) {}

  async createService(data: {
    name: string;
    description?: string;
    price: number;
    categoryId: string;
  }) {
    const { name, description, price, categoryId } = data;

    if (!name || name.trim().length === 0) {
      throw new BadRequestError("Service name is required");
    }

    if (price === undefined || price === null || price < 0) {
      throw new BadRequestError("Service price must be a non-negative number");
    }

    if (!categoryId || categoryId.trim().length === 0) {
      throw new BadRequestError("Service category ID is required");
    }

    const category = await this.serviceCategoryRepo.findById(categoryId);
    if (!category) {
      throw new NotFoundError("Service category not found");
    }

    return this.serviceRepo.create({
      name: name.trim(),
      description: description?.trim(),
      price,
      categoryId,
    });
  }

  async getAllServices() {
    return this.serviceRepo.findAll();
  }

  async getServiceById(id: string) {
    const service = await this.serviceRepo.findById(id);
    if (!service) {
      throw new NotFoundError("Service not found");
    }
    return service;
  }

  async getServicesByCategoryId(categoryId: string) {
    // Check if category exists
    const category = await this.serviceCategoryRepo.findById(categoryId);
    if (!category) {
      throw new NotFoundError("Service category not found");
    }

    return this.serviceRepo.findByCategoryId(categoryId);
  }

  async updateService(
    id: string,
    data: {
      name?: string;
      description?: string;
      price?: number;
      categoryId?: string;
    },
  ) {
    const { name, description, price, categoryId } = data;

    // Check if service exists
    const service = await this.serviceRepo.findById(id);
    if (!service) {
      throw new NotFoundError("Service not found");
    }

    if (name !== undefined && name.trim().length === 0) {
      throw new BadRequestError("Service name cannot be empty");
    }

    if (price !== undefined && price < 0) {
      throw new BadRequestError("Service price must be a non-negative number");
    }

    // If categoryId is being updated, check if it exists
    if (categoryId) {
      const category = await this.serviceCategoryRepo.findById(categoryId);
      if (!category) {
        throw new NotFoundError("Service category not found");
      }
    }

    return this.serviceRepo.update(id, {
      ...(name !== undefined && { name: name.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(price !== undefined && { price }),
      ...(categoryId !== undefined && { categoryId }),
    });
  }

  async deleteService(id: string) {
    // Check if service exists
    const service = await this.serviceRepo.findById(id);
    if (!service) {
      throw new NotFoundError("Service not found");
    }

    return this.serviceRepo.delete(id);
  }
}
