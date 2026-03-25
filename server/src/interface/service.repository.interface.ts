import { Service } from "@prisma/client";

export interface CreateServiceInput {
  name: string;
  description?: string;
  price: number;
  categoryId: string;
}

export interface UpdateServiceInput {
  name?: string;
  description?: string;
  price?: number;
  categoryId?: string;
}

export interface IServiceRepository {
  create(data: CreateServiceInput): Promise<Service>;

  findAll(): Promise<Service[]>;

  findById(id: string): Promise<Service | null>;

  findByCategoryId(categoryId: string): Promise<Service[]>;

  update(id: string, data: UpdateServiceInput): Promise<Service>;

  delete(id: string): Promise<Service>;
}
