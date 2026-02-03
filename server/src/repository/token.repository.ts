import { prisma } from "../lib/prisma";
import { IKeyTokenRepository } from "../interface/keyToken.repository.interface";

export class KeyTokenRepository implements IKeyTokenRepository {
  upsertToken(data: {
    userId: string;
    refreshToken: string;
    refreshTokensUsed: string[];
    publicKey: string;
    privateKey: string;
  }): Promise<any> {
    return prisma.key.upsert({
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
  findByUserId(userId: string) {
    return prisma.key.findUnique({ where: { userId } });
  }

  deleteByUserId(userId: string) {
    return prisma.key.delete({ where: { userId } });
  }

  updateRefreshToken(data: {
    userId: string;
    refreshToken: string;
    refreshTokensUsed: string[];
  }) {
    return prisma.key.update({
      where: { userId: data.userId },
      data: {
        refreshToken: data.refreshToken,
        refreshTokensUsed: data.refreshTokensUsed,
      },
    });
  }
}
