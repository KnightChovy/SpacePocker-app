import { ServiceCategory } from "@prisma/client";

export interface CreateServiceCategoryInput {
  name: string;
  description?: string;
  managerId: string;
}

export interface UpdateServiceCategoryInput {
  name?: string;
  description?: string;
}

export interface AddRoomServiceCategoryInput {
  roomId: string;
  categoryId: string;
}

export interface IServiceCategoryRepository {
  create(data: CreateServiceCategoryInput): Promise<ServiceCategory>;

  findAll(): Promise<ServiceCategory[]>;

  findById(id: string): Promise<ServiceCategory | null>;

  findByName(name: string): Promise<ServiceCategory | null>;

  update(
    id: string,
    data: UpdateServiceCategoryInput,
  ): Promise<ServiceCategory>;

  delete(id: string): Promise<ServiceCategory>;

  addRoomServiceCategory(data: AddRoomServiceCategoryInput): Promise<any>;

  removeRoomServiceCategory(roomId: string, categoryId: string): Promise<any>;

  findRoomServiceCategory(roomId: string, categoryId: string): Promise<any>;
}
