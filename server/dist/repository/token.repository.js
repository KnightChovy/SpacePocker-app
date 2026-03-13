"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyTokenRepository = void 0;
const prisma_1 = require("../lib/prisma");
class KeyTokenRepository {
    upsertToken(data) {
        return prisma_1.prisma.key.upsert({
            where: { userId: data.userId },
            update: {
                publicKey: data.publicKey,
                privateKey: data.privateKey,
                refreshToken: data.refreshToken,
            },
            create: {
                userId: data.userId,
                publicKey: data.publicKey,
                privateKey: data.privateKey,
                refreshToken: data.refreshToken,
                refreshTokensUsed: data.refreshTokensUsed,
            },
        });
    }
    findByUserId(userId) {
        return prisma_1.prisma.key.findUnique({ where: { userId } });
    }
    deleteByUserId(userId) {
        return prisma_1.prisma.key.delete({ where: { userId } });
    }
    updateRefreshToken(data) {
        return prisma_1.prisma.key.update({
            where: { userId: data.userId },
            data: {
                refreshToken: data.refreshToken,
                refreshTokensUsed: data.refreshTokensUsed,
            },
        });
    }
}
exports.KeyTokenRepository = KeyTokenRepository;
