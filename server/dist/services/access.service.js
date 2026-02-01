"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const error_response_1 = require("../core/error.response");
const prisma_1 = require("../lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const authUtils_1 = require("../auth/authUtils");
const keyToken_service_1 = __importDefault(require("./keyToken.service"));
class AccessService {
}
_a = AccessService;
AccessService.handleRefreshToken = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken, userId, email, key } = data;
    if (key.refreshTokensUsed.includes(refreshToken)) {
        yield prisma_1.prisma.key.delete({ where: { userId: userId } });
        throw new error_response_1.BadRequestError("Something wrong happened. Please login again");
    }
    if (key.refreshToken !== refreshToken) {
        throw new error_response_1.BadRequestError("Invalid refresh token");
    }
    const foundUser = yield prisma_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!foundUser) {
        throw new error_response_1.BadRequestError("User not registered");
    }
    const tokens = yield (0, authUtils_1.createTokenPair)({ userId: foundUser.id, email: foundUser.email }, key.publicKey, key.privateKey);
    yield prisma_1.prisma.key.update({
        where: { userId: userId },
        data: {
            refreshToken: tokens.refreshToken,
            refreshTokensUsed: [...key.refreshTokensUsed, refreshToken],
        },
    });
    return {
        User: {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
        },
        tokens: tokens,
    };
});
AccessService.logout = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = data;
    const result = prisma_1.prisma.key.delete({ where: { userId: userId } });
    return result;
});
AccessService.login = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = data;
    const foundUser = yield prisma_1.prisma.user.findUnique({
        where: { email: email },
    });
    if (!foundUser) {
        throw new error_response_1.BadRequestError("User not registered");
    }
    const match = yield bcrypt_1.default.compare(password, foundUser.password);
    if (!match) {
        throw new error_response_1.BadRequestError("Password is incorrect");
    }
    const { publicKey, privateKey } = crypto_1.default.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: "spki",
            format: "pem",
        },
        privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
        },
    });
    const tokens = yield (0, authUtils_1.createTokenPair)({ userId: foundUser.id, email: foundUser.email }, publicKey, privateKey);
    yield keyToken_service_1.default.createKeyToken(foundUser.id, publicKey, privateKey, tokens.refreshToken);
    return {
        User: {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
        },
        tokens: tokens,
    };
});
AccessService.signUp = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name, phone } = data;
    const foundUser = yield prisma_1.prisma.user.findUnique({
        where: { email: email },
    });
    if (foundUser) {
        throw new error_response_1.BadRequestError("Email already exists");
    }
    const passwordHash = yield bcrypt_1.default.hash(password, 10);
    const newUser = yield prisma_1.prisma.user.create({
        data: {
            name: name,
            email: email,
            password: passwordHash,
            phoneNumber: phone,
            role: "USER",
        },
    });
    const { publicKey, privateKey } = crypto_1.default.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: "spki",
            format: "pem",
        },
        privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
        },
    });
    const tokens = yield (0, authUtils_1.createTokenPair)({ userId: newUser.id, email: newUser.email }, publicKey, privateKey);
    const keyStore = yield keyToken_service_1.default.createKeyToken(newUser.id, publicKey, privateKey, tokens.refreshToken);
    if (!keyStore) {
        throw new error_response_1.BadRequestError("User already exists");
    }
    return {
        User: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phoneNumber,
        },
        tokens: tokens,
    };
});
exports.default = AccessService;
