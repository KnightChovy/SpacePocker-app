import { prisma } from "../lib/prisma";

class KeyTokenService {
  static async createKeyToken(
    userId: string,
    publicKey: string,
    privateKey: string,
    refreshToken: string
  ) {
    const tokens = await prisma.key.upsert({
      where: { userId },
      update: {
        publicKey,
        privateKey,
        refreshToken,
      },
      create: {
        userId,
        publicKey,
        privateKey,
        refreshToken,
        refreshTokensUsed: [],
      },
    });

    return tokens ? tokens.publicKey : null;
  }
}

export default KeyTokenService;
