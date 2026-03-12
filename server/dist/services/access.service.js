"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const error_response_1 = require("../core/error.response");
const crypto_1 = __importDefault(require("crypto"));
const authUtils_1 = require("../auth/authUtils");
class AccessService {
    constructor(userRepo, keyRepo, keyTokenService) {
        this.userRepo = userRepo;
        this.keyRepo = keyRepo;
        this.keyTokenService = keyTokenService;
    }
    async login(data) {
        const { email, password } = data;
        const foundUser = await this.userRepo.findByEmail(email);
        if (!foundUser)
            throw new error_response_1.BadRequestError("User not registered");
        const match = await bcrypt_1.default.compare(password, foundUser.password);
        if (!match)
            throw new error_response_1.BadRequestError("Password is incorrect");
        const { publicKey, privateKey } = crypto_1.default.generateKeyPairSync("rsa", {
            modulusLength: 2048,
            publicKeyEncoding: { type: "spki", format: "pem" },
            privateKeyEncoding: { type: "pkcs8", format: "pem" },
        });
        const tokens = await (0, authUtils_1.createTokenPair)({ userId: foundUser.id, email: foundUser.email, role: foundUser.role }, publicKey, privateKey);
        await this.keyTokenService.createKeyToken(foundUser.id, publicKey, privateKey, tokens.refreshToken);
        return {
            user: { id: foundUser.id, name: foundUser.name, email: foundUser.email },
            tokens,
        };
    }
    async signUp(data) {
        const { email, password, name, phone } = data;
        const foundUser = await this.userRepo.findByEmail(email);
        if (foundUser)
            throw new error_response_1.BadRequestError("Email already exists");
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const newUser = await this.userRepo.createUser({
            name,
            email,
            password: passwordHash,
            phone,
        });
        const { publicKey, privateKey } = crypto_1.default.generateKeyPairSync("rsa", {
            modulusLength: 2048,
            publicKeyEncoding: { type: "spki", format: "pem" },
            privateKeyEncoding: { type: "pkcs8", format: "pem" },
        });
        const tokens = await (0, authUtils_1.createTokenPair)({ userId: newUser.id, email: newUser.email, role: newUser.role }, publicKey, privateKey);
        await this.keyTokenService.createKeyToken(newUser.id, publicKey, privateKey, tokens.refreshToken);
        return {
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phoneNumber,
            },
            tokens,
        };
    }
    async logout(userId) {
        return this.keyRepo.deleteByUserId(userId);
    }
    async handleRefreshToken(data) {
        const { refreshToken, userId } = data;
        const key = await this.keyRepo.findByUserId(userId);
        if (!key)
            throw new error_response_1.BadRequestError("Invalid refresh token");
        if (key.refreshTokensUsed.includes(refreshToken)) {
            await this.keyRepo.deleteByUserId(userId);
            throw new error_response_1.BadRequestError("Something wrong happened. Please login again");
        }
        if (key.refreshToken !== refreshToken) {
            throw new error_response_1.BadRequestError("Invalid refresh token");
        }
        const foundUser = await this.userRepo.findById(userId);
        if (!foundUser)
            throw new error_response_1.BadRequestError("User not registered");
        const tokens = await (0, authUtils_1.createTokenPair)({ userId: foundUser.id, email: foundUser.email, role: foundUser.role }, key.publicKey, key.privateKey);
        await this.keyRepo.updateRefreshToken({
            userId,
            refreshToken: tokens.refreshToken,
            refreshTokensUsed: [...key.refreshTokensUsed, refreshToken],
        });
        return {
            user: {
                id: foundUser.id,
                name: foundUser.name,
                email: foundUser.email,
                role: foundUser.role,
            },
            tokens,
        };
    }
}
exports.default = AccessService;
