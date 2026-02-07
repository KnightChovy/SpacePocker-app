"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildingService = void 0;
const error_response_1 = require("../core/error.response");
class BuildingService {
    constructor(buildingRepository) {
        this.buildingRepository = buildingRepository;
    }
    async createBuilding(data) {
        const { buildingName, address, description, campus, managerId } = data;
        if (!buildingName || !address) {
            throw new error_response_1.BadRequestError('Name and address are required');
        }
        if (!campus) {
            throw new error_response_1.BadRequestError('Campus is required');
        }
        if (!managerId) {
            throw new error_response_1.BadRequestError('Manager ID is required');
        }
        const createBuilding = await this.buildingRepository.create({
            buildingName,
            address,
            description,
            campus,
            managerId,
        });
        return { createBuilding };
    }
    async getBuildingById(id) {
        if (!id) {
            throw new error_response_1.BadRequestError('Building ID is required!');
        }
        const building = await this.buildingRepository.findById(id);
        if (!building) {
            throw new error_response_1.NotFoundError('Building not found!');
        }
        return {
            building,
        };
    }
    async getAllBuildings(query) {
        const { search, campus, sortBy, sortOrder, limit, offset } = query;
        const filter = {};
        if (search && typeof search === 'string') {
            filter.buildingName = {
                contains: search,
                mode: 'insensitive',
            };
        }
        if (campus && typeof campus === 'string') {
            filter.campus = campus;
        }
        let orderBy = undefined;
        if (sortBy) {
            const validSortFields = ['buildingName', 'campus', 'createdAt'];
            const validSortOrders = ['asc', 'desc'];
            if (validSortFields.includes(sortBy)) {
                const order = validSortOrders.includes(sortOrder?.toLowerCase())
                    ? sortOrder.toLowerCase()
                    : 'asc';
                orderBy = { [sortBy]: order };
            }
        }
        const parsedLimit = limit ? parseInt(String(limit), 10) : 10;
        const parsedOffset = offset ? parseInt(String(offset), 10) : 0;
        const safeLimit = !isNaN(parsedLimit) && parsedLimit > 0 && parsedLimit <= 100
            ? parsedLimit
            : 10;
        const safeOffset = !isNaN(parsedOffset) && parsedOffset >= 0 ? parsedOffset : 0;
        const total = await this.buildingRepository.count(Object.keys(filter).length > 0 ? filter : undefined);
        const buildings = await this.buildingRepository.findAll(Object.keys(filter).length > 0 ? filter : undefined, orderBy, safeLimit, safeOffset);
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
    async updateBuilding(id, data) {
        if (!id) {
            throw new error_response_1.BadRequestError('Building ID is required!');
        }
        const foundId = await this.buildingRepository.findById(id);
        if (!foundId) {
            throw new error_response_1.NotFoundError('Building not found!');
        }
        const updateData = {};
        if (data.name) {
            updateData.buildingName = data.name;
        }
        if (data.address) {
            updateData.address = data.address;
        }
        if (data.description !== undefined) {
            updateData.description = data.description;
        }
        if (data.campus) {
            updateData.campus = data.campus;
        }
        if (data.managerId) {
            updateData.managerId = data.managerId;
        }
        const updateBuilding = await this.buildingRepository.update(id, updateData);
        return {
            updateBuilding,
        };
    }
    async deleteBuilding(id) {
        if (!id) {
            throw new error_response_1.BadRequestError('Building ID is required!!');
        }
        const deleteBuilding = await this.buildingRepository.findById(id);
        if (!deleteBuilding) {
            throw new error_response_1.NotFoundError('Building not found!');
        }
        await this.buildingRepository.delete(id);
        return {
            message: 'Building delete successfully!',
        };
    }
}
exports.BuildingService = BuildingService;
