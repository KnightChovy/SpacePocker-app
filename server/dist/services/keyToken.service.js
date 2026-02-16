"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class KeyTokenService {
    constructor(keyRepo) {
        this.keyRepo = keyRepo;
    }
    async createKeyToken(userId, publicKey, privateKey, refreshToken) {
        const tokens = await this.keyRepo.upsertToken({
            userId,
            publicKey,
            privateKey,
            refreshToken,
            refreshTokensUsed: [],
        });
        return tokens.publicKey;
    }
}
exports.default = KeyTokenService;
