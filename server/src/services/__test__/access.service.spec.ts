import AccessService from "../access.service";
import { BadRequestError } from "../../core/error.response";

// mock bcrypt
import bcrypt from "bcrypt";
jest.mock("bcrypt", () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

// mock crypto generateKeyPairSync
import crypto from "crypto";
jest.mock("crypto", () => ({
  generateKeyPairSync: jest.fn(),
}));

// mock createTokenPair
import { createTokenPair } from "../../auth/authUtils";
jest.mock("../../auth/authUtils", () => ({
  createTokenPair: jest.fn(),
}));

describe("AccessService", () => {
  let userRepo: any;
  let keyRepo: any;
  let keyTokenService: any;
  let accessService: AccessService;

  beforeEach(() => {
    userRepo = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      createUser: jest.fn(),
    };

    keyRepo = {
      findByUserId: jest.fn(),
      deleteByUserId: jest.fn(),
      updateRefreshToken: jest.fn(),
    };

    keyTokenService = {
      createKeyToken: jest.fn(),
    };

    accessService = new AccessService(userRepo, keyRepo, keyTokenService);

    jest.clearAllMocks();
  });

  // ===========================
  // LOGIN
  // ===========================
  describe("login()", () => {
    it("should throw if user not found", async () => {
      userRepo.findByEmail.mockResolvedValue(null);

      await expect(
        accessService.login({ email: "a@gmail.com", password: "123" })
      ).rejects.toBeInstanceOf(BadRequestError);

      expect(userRepo.findByEmail).toHaveBeenCalledWith("a@gmail.com");
    });

    it("should throw if password incorrect", async () => {
      userRepo.findByEmail.mockResolvedValue({
        id: "u1",
        email: "a@gmail.com",
        name: "A",
        password: "hashed",
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        accessService.login({ email: "a@gmail.com", password: "wrong" })
      ).rejects.toBeInstanceOf(BadRequestError);

      expect(bcrypt.compare).toHaveBeenCalledWith("wrong", "hashed");
    });

    it("should login successfully and return user + tokens", async () => {
      userRepo.findByEmail.mockResolvedValue({
        id: "u1",
        email: "a@gmail.com",
        name: "A",
        password: "hashed",
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      (crypto.generateKeyPairSync as jest.Mock).mockReturnValue({
        publicKey: "PUBLIC_KEY",
        privateKey: "PRIVATE_KEY",
      });

      (createTokenPair as jest.Mock).mockResolvedValue({
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

      expect(keyTokenService.createKeyToken).toHaveBeenCalledWith(
        "u1",
        "PUBLIC_KEY",
        "PRIVATE_KEY",
        "REFRESH_TOKEN"
      );
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

      await expect(
        accessService.signUp({
          email: "a@gmail.com",
          password: "123",
          name: "A",
        })
      ).rejects.toBeInstanceOf(BadRequestError);

      expect(userRepo.findByEmail).toHaveBeenCalledWith("a@gmail.com");
    });

    it("should signup successfully", async () => {
      userRepo.findByEmail.mockResolvedValue(null);

      (bcrypt.hash as jest.Mock).mockResolvedValue("HASHED_PASSWORD");

      userRepo.createUser.mockResolvedValue({
        id: "u2",
        email: "b@gmail.com",
        name: "B",
        phoneNumber: "0123",
      });

      (crypto.generateKeyPairSync as jest.Mock).mockReturnValue({
        publicKey: "PUBLIC_KEY",
        privateKey: "PRIVATE_KEY",
      });

      (createTokenPair as jest.Mock).mockResolvedValue({
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
    it("should call deleteByUserId", async () => {
      keyRepo.deleteByUserId.mockResolvedValue(true);

      const result = await accessService.logout("u1");

      expect(keyRepo.deleteByUserId).toHaveBeenCalledWith("u1");
      expect(result).toBe(true);
    });
  });

  // ===========================
  // REFRESH TOKEN
  // ===========================
  describe("handleRefreshToken()", () => {
    it("should throw if key not found", async () => {
      keyRepo.findByUserId.mockResolvedValue(null);

      await expect(
        accessService.handleRefreshToken({
          refreshToken: "RT",
          userId: "u1",
          email: "a@gmail.com",
        })
      ).rejects.toBeInstanceOf(BadRequestError);

      expect(keyRepo.findByUserId).toHaveBeenCalledWith("u1");
    });

    it("should delete key and throw if refreshToken is used", async () => {
      keyRepo.findByUserId.mockResolvedValue({
        refreshToken: "RT_CURRENT",
        refreshTokensUsed: ["RT_USED"],
      });

      await expect(
        accessService.handleRefreshToken({
          refreshToken: "RT_USED",
          userId: "u1",
          email: "a@gmail.com",
        })
      ).rejects.toBeInstanceOf(BadRequestError);

      expect(keyRepo.deleteByUserId).toHaveBeenCalledWith("u1");
    });

    it("should throw if refreshToken mismatch", async () => {
      keyRepo.findByUserId.mockResolvedValue({
        refreshToken: "RT_CURRENT",
        refreshTokensUsed: [],
      });

      await expect(
        accessService.handleRefreshToken({
          refreshToken: "RT_OTHER",
          userId: "u1",
          email: "a@gmail.com",
        })
      ).rejects.toBeInstanceOf(BadRequestError);
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

      (createTokenPair as jest.Mock).mockResolvedValue({
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
