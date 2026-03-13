"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_1 = require("../lib/prisma");
class UserRepository {
    findByEmail(email) {
        return prisma_1.prisma.user.findUnique({ where: { email } });
    }
    findById(id) {
        return prisma_1.prisma.user.findUnique({ where: { id } });
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
}
exports.UserRepository = UserRepository;
