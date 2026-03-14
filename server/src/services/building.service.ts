import { BadRequestError, NotFoundError } from "../core/error.response";
import { IBuildingRepository } from "../interface/building.repository.interface";
import {
  CreateBuildingDTO,
  UpdateBuildingDTO,
} from "../types/buildings/building.type";

export class BuildingService {
  constructor(private buildingRepository: IBuildingRepository) {}

  async createBuilding(data: CreateBuildingDTO) {
    const { buildingName, address, campus, managerId, latitude, longitude } =
      data;

    // Validation
    if (!buildingName || buildingName.trim() === '') {
      throw new BadRequestError('Building name is required');
    }

    if (!address || address.trim() === '') {
      throw new BadRequestError('Address is required');
    }

    if (!campus || campus.trim() === '') {
      throw new BadRequestError('Campus is required');
    }

    if (!managerId) {
      throw new BadRequestError("Manager ID is required");
    }

    // Validate latitude and longitude if provided
    if (latitude !== undefined) {
      if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
        throw new BadRequestError('Latitude must be between -90 and 90');
      }
    }

    if (longitude !== undefined) {
      if (
        typeof longitude !== 'number' ||
        longitude < -180 ||
        longitude > 180
      ) {
        throw new BadRequestError('Longitude must be between -180 and 180');
      }
    }

    const building = await this.buildingRepository.create({
      buildingName,
      address,
      campus,
      managerId,
      latitude,
      longitude,
    });

    return { building };
  }

  async getBuildingById(id: string) {
    if (!id) {
      throw new BadRequestError("Building ID is required!");
    }

    const building = await this.buildingRepository.findById(id);

    if (!building) {
      throw new NotFoundError("Building not found!");
    }

    return {
      building,
    };
  }

  async getAllBuildings(query: any) {
    const { search, campus, sortBy, sortOrder, limit, offset } = query;

    const filter: any = {};
    if (search && typeof search === "string") {
      filter.buildingName = {
        contains: search,
        mode: "insensitive",
      };
    }
    if (campus && typeof campus === "string") {
      filter.campus = campus;
    }

    let orderBy: any = undefined;
    if (sortBy) {
      const validSortFields = ["buildingName", "campus", "createdAt"];
      const validSortOrders = ["asc", "desc"];

      if (validSortFields.includes(sortBy)) {
        const order = validSortOrders.includes(sortOrder?.toLowerCase())
          ? sortOrder.toLowerCase()
          : "asc";

        orderBy = { [sortBy]: order };
      }
    }

    const parsedLimit = limit ? parseInt(String(limit), 10) : 10;
    const parsedOffset = offset ? parseInt(String(offset), 10) : 0;

    const safeLimit =
      !isNaN(parsedLimit) && parsedLimit > 0 && parsedLimit <= 100
        ? parsedLimit
        : 10;
    const safeOffset =
      !isNaN(parsedOffset) && parsedOffset >= 0 ? parsedOffset : 0;

    const total = await this.buildingRepository.count(
      Object.keys(filter).length > 0 ? filter : undefined,
    );

    const buildings = await this.buildingRepository.findAll(
      Object.keys(filter).length > 0 ? filter : undefined,
      orderBy,
      safeLimit,
      safeOffset,
    );

    return {
      buildings,
      pagination: {
        total,
        limit: safeLimit,
        offset: safeOffset,
        hasMore: safeOffset + buildings.length < total,
      },
      filters: {
        search: search || null,
        campus: campus || null,
        sortBy: sortBy || null,
        sortOrder: orderBy ? Object.values(orderBy)[0] : null,
      },
    };
  }

  async updateBuilding(id: string, data: UpdateBuildingDTO) {
    if (!id) {
      throw new BadRequestError('Building ID is required');
    }

    const existingBuilding = await this.buildingRepository.findById(id);

    if (!existingBuilding) {
      throw new NotFoundError('Building not found');
    }

    if (data.buildingName !== undefined && data.buildingName.trim() === '') {
      throw new BadRequestError('Building name cannot be empty');
    }

    if (data.address !== undefined && data.address.trim() === '') {
      throw new BadRequestError('Address cannot be empty');
    }

    if (data.campus !== undefined && data.campus.trim() === '') {
      throw new BadRequestError('Campus cannot be empty');
    }

    if (data.latitude !== undefined) {
      if (
        typeof data.latitude !== 'number' ||
        data.latitude < -90 ||
        data.latitude > 90
      ) {
        throw new BadRequestError('Latitude must be between -90 and 90');
      }
    }

    if (data.longitude !== undefined) {
      if (
        typeof data.longitude !== 'number' ||
        data.longitude < -180 ||
        data.longitude > 180
      ) {
        throw new BadRequestError('Longitude must be between -180 and 180');
      }
    }

    const building = await this.buildingRepository.update(id, data);

    return { building };
  }

  async deleteBuilding(id: string) {
    if (!id) {
      throw new BadRequestError('Building ID is required');
    }

    const existingBuilding = await this.buildingRepository.findById(id);

    if (!existingBuilding) {
      throw new NotFoundError('Building not found');
    }

    const building = await this.buildingRepository.delete(id);

    return { building };
  }
}
