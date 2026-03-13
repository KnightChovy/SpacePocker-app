export interface CreateBuildingDTO {
  buildingName: string;
  address: string;
  campus: string;
  managerId: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateBuildingDTO {
  buildingName?: string;
  address?: string;
  campus?: string;
  managerId?: string;
  latitude?: number;
  longitude?: number;
}

export interface BuildingQueryParams {
  search?: string;
  campus?: string;
  sortBy?: "buildingName" | "campus" | "createdAt";
  sortOrder?: "asc" | "desc";
  limit?: string | number;
  offset?: string | number;
}

export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface GetAllBuildingsResponse {
  buildings: any[];
  pagination: PaginationMeta;
  filters: {
    search: string | null;
    campus: string | null;
    sortBy: string | null;
    sortOrder: string | null;
  };
}
