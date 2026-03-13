"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const access_service_1 = __importDefault(require("../access.service"));
const error_response_1 = require("../../core/error.response");
// mock bcrypt
const bcrypt_1 = __importDefault(require("bcrypt"));
jest.mock("bcrypt", () => ({
    compare: jest.fn(),
    hash: jest.fn(),
}));
// mock crypto generateKeyPairSync
const crypto_1 = __importDefault(require("crypto"));
jest.mock("crypto", () => ({
    generateKeyPairSync: jest.fn(),
}));
// mock createTokenPair
const authUtils_1 = require("../../auth/authUtils");
jest.mock("../../auth/authUtils", () => ({
    createTokenPair: jest.fn(),
}));
describe("AccessService", () => {
    let userRepo;
    let keyRepo;
    let keyTokenService;
    let accessService;
    beforeEach(() => {
        userRepo = {
            findByEmail: jest.fn(),
            findById: jest.fn(),
            createUser: jest.fn(),
        };
        keyRepo = {
            findByUserId: jest.fn(),
            deleteTokenByUserId: jest.fn(),
            updateRefreshToken: jest.fn(),
        };
        keyTokenService = {
            createKeyToken: jest.fn(),
        };
        accessService = new access_service_1.default(userRepo, keyRepo, keyTokenService);
        jest.clearAllMocks();
    });
    // ===========================
    // LOGIN
    // ===========================
    describe("login()", () => {
        it("should throw if user not found", async () => {
            userRepo.findByEmail.mockResolvedValue(null);
            await expect(accessService.login({ email: "a@gmail.com", password: "123" })).rejects.toBeInstanceOf(error_response_1.BadRequestError);
            expect(userRepo.findByEmail).toHaveBeenCalledWith("a@gmail.com");
        });
        it("should throw if password incorrect", async () => {
            userRepo.findByEmail.mockResolvedValue({
                id: "u1",
                email: "a@gmail.com",
                name: "A",
                password: "hashed",
            });
            bcrypt_1.default.compare.mockResolvedValue(false);
            await expect(accessService.login({ email: "a@gmail.com", password: "wrong" })).rejects.toBeInstanceOf(error_response_1.BadRequestError);
            expect(bcrypt_1.default.compare).toHaveBeenCalledWith("wrong", "hashed");
        });
        it("should login successfully and return user + tokens", async () => {
            userRepo.findByEmail.mockResolvedValue({
                id: "u1",
                email: "a@gmail.com",
                name: "A",
                password: "hashed",
            });
            bcrypt_1.default.compare.mockResolvedValue(true);
            crypto_1.default.generateKeyPairSync.mockReturnValue({
                publicKey: "PUBLIC_KEY",
                privateKey: "PRIVATE_KEY",
            });
            authUtils_1.createTokenPair.mockResolvedValue({
                accessToken: "ACCESS_TOKEN",
                refreshToken: "REFRESH_TOKEN",
            });
            keyTokenService.createKeyToken.mockResolvedValue(true);
            const result = await accessService.login({
                email: "a@gmail.com",
                password: "123",
            });
            expect(result).toEqual({
                user: { id: "u1", name: "A", email: "a@gmail.com" },
                tokens: { accessToken: "ACCESS_TOKEN", refreshToken: "REFRESH_TOKEN" },
            });
            expect(keyTokenService.createKeyToken).toHaveBeenCalledWith("u1", "PUBLIC_KEY", "PRIVATE_KEY", "REFRESH_TOKEN");
        });
    });
    // ===========================
    // SIGNUP
    // ===========================
    describe("signUp()", () => {
        it("should throw if email already exists", async () => {
            userRepo.findByEmail.mockResolvedValue({
                id: "u1",
                email: "a@gmail.com",
            });
            await expect(accessService.signUp({
                email: "a@gmail.com",
                password: "123",
                name: "A",
            })).rejects.toBeInstanceOf(error_response_1.BadRequestError);
            expect(userRepo.findByEmail).toHaveBeenCalledWith("a@gmail.com");
        });
        it("should signup successfully", async () => {
            userRepo.findByEmail.mockResolvedValue(null);
            bcrypt_1.default.hash.mockResolvedValue("HASHED_PASSWORD");
            userRepo.createUser.mockResolvedValue({
                id: "u2",
                email: "b@gmail.com",
                name: "B",
                phoneNumber: "0123",
            });
            crypto_1.default.generateKeyPairSync.mockReturnValue({
                publicKey: "PUBLIC_KEY",
                privateKey: "PRIVATE_KEY",
            });
            authUtils_1.createTokenPair.mockResolvedValue({
                accessToken: "ACCESS_TOKEN",
                refreshToken: "REFRESH_TOKEN",
            });
            const result = await accessService.signUp({
                email: "b@gmail.com",
                password: "123",
                name: "B",
                phone: "0123",
            });
            expect(userRepo.createUser).toHaveBeenCalledWith({
                name: "B",
                email: "b@gmail.com",
                password: "HASHED_PASSWORD",
                phone: "0123",
            });
            expect(result).toEqual({
                user: {
                    id: "u2",
                    name: "B",
                    email: "b@gmail.com",
                    phone: "0123",
                },
                tokens: {
                    accessToken: "ACCESS_TOKEN",
                    refreshToken: "REFRESH_TOKEN",
                },
            });
        });
    });
    // ===========================
    // LOGOUT
    // ===========================
    describe("logout()", () => {
        it("should call deleteTokenByUserId", async () => {
            keyRepo.deleteTokenByUserId.mockResolvedValue(true);
            const result = await accessService.logout({ userId: "u1" });
            expect(keyRepo.deleteTokenByUserId).toHaveBeenCalledWith("u1");
            expect(result).toBe(true);
        });
    });
    // ===========================
    // REFRESH TOKEN
    // ===========================
    describe("handleRefreshToken()", () => {
        it("should throw if key not found", async () => {
            keyRepo.findByUserId.mockResolvedValue(null);
            await expect(accessService.handleRefreshToken({
                refreshToken: "RT",
                userId: "u1",
                email: "a@gmail.com",
            })).rejects.toBeInstanceOf(error_response_1.BadRequestError);
            expect(keyRepo.findByUserId).toHaveBeenCalledWith("u1");
        });
        it("should delete key and throw if refreshToken is used", async () => {
            keyRepo.findByUserId.mockResolvedValue({
                refreshToken: "RT_CURRENT",
                refreshTokensUsed: ["RT_USED"],
            });
            await expect(accessService.handleRefreshToken({
                refreshToken: "RT_USED",
                userId: "u1",
                email: "a@gmail.com",
            })).rejects.toBeInstanceOf(error_response_1.BadRequestError);
            expect(keyRepo.deleteTokenByUserId).toHaveBeenCalledWith("u1");
        });
        it("should throw if refreshToken mismatch", async () => {
            keyRepo.findByUserId.mockResolvedValue({
                refreshToken: "RT_CURRENT",
                refreshTokensUsed: [],
            });
            await expect(accessService.handleRefreshToken({
                refreshToken: "RT_OTHER",
                userId: "u1",
                email: "a@gmail.com",
            })).rejects.toBeInstanceOf(error_response_1.BadRequestError);
        });
        it("should refresh token successfully", async () => {
            keyRepo.findByUserId.mockResolvedValue({
                publicKey: "PUBLIC_KEY",
                privateKey: "PRIVATE_KEY",
                refreshToken: "RT_CURRENT",
                refreshTokensUsed: [],
            });
            userRepo.findById.mockResolvedValue({
                id: "u1",
                email: "a@gmail.com",
                name: "A",
            });
            authUtils_1.createTokenPair.mockResolvedValue({
                accessToken: "NEW_ACCESS",
                refreshToken: "NEW_REFRESH",
            });
            keyRepo.updateRefreshToken.mockResolvedValue(true);
            const result = await accessService.handleRefreshToken({
                refreshToken: "RT_CURRENT",
                userId: "u1",
                email: "a@gmail.com",
            });
            expect(keyRepo.updateRefreshToken).toHaveBeenCalledWith({
                userId: "u1",
                refreshToken: "NEW_REFRESH",
                refreshTokensUsed: ["RT_CURRENT"],
            });
            expect(result).toEqual({
                user: { id: "u1", name: "A", email: "a@gmail.com" },
                tokens: {
                    accessToken: "NEW_ACCESS",
                    refreshToken: "NEW_REFRESH",
                },
            });
        });
    });
});
