export interface IBuildingRepository {
  create(data: any): Promise<any>;
  findById(id: string): Promise<any>;
  findAll(
    filter?: any,
    orderBy?: any,
    limit?: number,
    offset?: number,
  ): Promise<any[]>;
  count(filter?: any): Promise<number>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<any>;
}
