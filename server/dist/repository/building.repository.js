"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildingRepository = void 0;
class BuildingRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return await this.prisma.building.create({
            data,
        });
    }
    async findById(id) {
        return await this.prisma.building.findUnique({
            where: { id },
            include: {
                rooms: true,
            },
        });
    }
    async findAll(filter, orderBy, limit, offset) {
        return await this.prisma.building.findMany({
            where: filter,
            orderBy: orderBy,
            take: limit,
            skip: offset,
            include: {
                rooms: true,
            },
        });
    }
    async count(filter) {
        return await this.prisma.building.count({
            where: filter,
        });
    }
    async update(id, data) {
        return await this.prisma.building.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return await this.prisma.building.delete({
            where: { id },
        });
    }
}
exports.BuildingRepository = BuildingRepository;
