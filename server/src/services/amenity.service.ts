import { IAmenityRepository } from "../interface/amenity.repository.interface";
import { IRoomRepository } from "../interface/room.repository.interface";
import {
  BadRequestError,
  NotFoundError,
  ConflictRequestError,
} from "../core/error.response";

export default class AmenityService {
  constructor(
    private amenityRepo: IAmenityRepository,
    private roomRepo: IRoomRepository,
  ) {}

  async createAmenity(data: { name: string }) {
    const { name } = data;

    if (!name || name.trim().length === 0) {
      throw new BadRequestError("Amenity name is required");
    }

    // Check if amenity with same name already exists
    const existing = await this.amenityRepo.findByName(name);
    if (existing) {
      throw new ConflictRequestError("Amenity with this name already exists");
    }

    return this.amenityRepo.create({ name: name.trim() });
  }

  async getAllAmenities() {
    return this.amenityRepo.findAll();
  }

  async getAmenityById(id: string) {
    const amenity = await this.amenityRepo.findById(id);
    if (!amenity) {
      throw new NotFoundError("Amenity not found");
    }
    return amenity;
  }

  async updateAmenity(id: string, data: { name: string }) {
    const { name } = data;

    if (!name || name.trim().length === 0) {
      throw new BadRequestError("Amenity name is required");
    }

    // Check if amenity exists
    const amenity = await this.amenityRepo.findById(id);
    if (!amenity) {
      throw new NotFoundError("Amenity not found");
    }

    // Check if another amenity with same name exists
    const existing = await this.amenityRepo.findByName(name);
    if (existing && existing.id !== id) {
      throw new ConflictRequestError("Amenity with this name already exists");
    }

    return this.amenityRepo.update(id, { name: name.trim() });
  }

  async deleteAmenity(id: string) {
    // Check if amenity exists
    const amenity = await this.amenityRepo.findById(id);
    if (!amenity) {
      throw new NotFoundError("Amenity not found");
    }

    return this.amenityRepo.delete(id);
  }

  async addRoomAmenity(data: { roomId: string; amenityId: string }) {
    const { roomId, amenityId } = data;

    // Check if room exists
    const room = await this.roomRepo.findById(roomId);
    if (!room) {
      throw new NotFoundError("Room not found");
    }

    // Check if amenity exists
    const amenity = await this.amenityRepo.findById(amenityId);
    if (!amenity) {
      throw new NotFoundError("Amenity not found");
    }

    // Check if room amenity already exists
    const existing = await this.amenityRepo.findRoomAmenity(roomId, amenityId);
    if (existing) {
      throw new ConflictRequestError("Room amenity already exists");
    }

    return this.amenityRepo.addRoomAmenity({ roomId, amenityId });
  }

  async removeRoomAmenity(roomId: string, amenityId: string) {
    // Check if room amenity exists
    const existing = await this.amenityRepo.findRoomAmenity(roomId, amenityId);
    if (!existing) {
      throw new NotFoundError("Room amenity not found");
    }

    return this.amenityRepo.removeRoomAmenity(roomId, amenityId);
  }
}
