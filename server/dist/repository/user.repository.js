"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_1 = require("../lib/prisma");
class UserRepository {
    findByEmail(email) {
        return prisma_1.prisma.user.findUnique({ where: { email } });
    }
    findById(id) {
        return prisma_1.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    updateRole(id, role) {
        return prisma_1.prisma.user.update({
            where: { id },
            data: { role },
        });
    }
    createUser(data) {
        return prisma_1.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password,
                phoneNumber: data.phone,
                role: "USER",
            },
        });
    }
    async findMany(filter, pagination) {
        const where = {};
        if (filter.search) {
            where.OR = [
                { name: { contains: filter.search, mode: "insensitive" } },
                { email: { contains: filter.search, mode: "insensitive" } },
            ];
        }
        if (filter.role) {
            where.role = filter.role;
        }
        return prisma_1.prisma.user.findMany({
            where,
            skip: pagination.skip,
            take: pagination.take,
            select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async count(filter) {
        const where = {};
        if (filter.search) {
            where.OR = [
                { name: { contains: filter.search, mode: "insensitive" } },
                { email: { contains: filter.search, mode: "insensitive" } },
            ];
        }
        if (filter.role) {
            where.role = filter.role;
        }
        return prisma_1.prisma.user.count({ where });
    }
}
exports.UserRepository = UserRepository;
