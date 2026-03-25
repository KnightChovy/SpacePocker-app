import { Amenity, RoomAmenity } from "@prisma/client";

export interface CreateAmenityInput {
  name: string;
}

export interface UpdateAmenityInput {
  name: string;
}

export interface CreateRoomAmenityInput {
  roomId: string;
  amenityId: string;
}

export interface IAmenityRepository {
  create(data: CreateAmenityInput): Promise<Amenity>;

  findAll(): Promise<Amenity[]>;

  findById(id: string): Promise<Amenity | null>;

  findByName(name: string): Promise<Amenity | null>;

  update(id: string, data: UpdateAmenityInput): Promise<Amenity>;

  delete(id: string): Promise<Amenity>;

  addRoomAmenity(data: CreateRoomAmenityInput): Promise<RoomAmenity>;

  removeRoomAmenity(roomId: string, amenityId: string): Promise<RoomAmenity>;

  findRoomAmenity(
    roomId: string,
    amenityId: string,
  ): Promise<RoomAmenity | null>;
}
