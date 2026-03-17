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

import jwt from "jsonwebtoken";
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe("AccessService", () => {
  let userRepo: any;
  let keyRepo: any;
  let keyTokenService: any;
  let mailService: any;
  let accessService: AccessService;

  beforeEach(() => {
    userRepo = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findByIdWithPassword: jest.fn(),
      updatePassword: jest.fn(),
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

    mailService = {
      sendPasswordResetOtpEmail: jest.fn(),
    };

    accessService = new AccessService(
      userRepo,
      keyRepo,
      keyTokenService,
      mailService,
    );

    jest.clearAllMocks();
  });

  // ===========================
  // LOGIN
  // ===========================
  describe("login()", () => {
    it("should throw if user not found", async () => {
      userRepo.findByEmail.mockResolvedValue(null);

      await expect(
        accessService.login({ email: "a@gmail.com", password: "123" }),
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
        accessService.login({ email: "a@gmail.com", password: "wrong" }),
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
        "REFRESH_TOKEN",
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
        }),
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

      await expect(
        accessService.handleRefreshToken({
          refreshToken: "RT",
          userId: "u1",
          email: "a@gmail.com",
        }),
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
        }),
      ).rejects.toBeInstanceOf(BadRequestError);

      expect(keyRepo.deleteTokenByUserId).toHaveBeenCalledWith("u1");
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
        }),
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

  describe("forgotPassword()", () => {
    it("should throw if email is missing", async () => {
      await expect(accessService.forgotPassword({ email: "" })).rejects.toBeInstanceOf(
        BadRequestError,
      );
    });

    it("should return generic success when user not found", async () => {
      userRepo.findByEmail.mockResolvedValue(null);

      const result = await accessService.forgotPassword({
        email: "missing@gmail.com",
      });

      expect(result).toEqual({
        sent: true,
        message: "If this email exists, an OTP has been sent",
      });
      expect(mailService.sendPasswordResetOtpEmail).not.toHaveBeenCalled();
    });

    it("should generate otpToken and send OTP email when user exists", async () => {
      process.env.PASSWORD_RESET_OTP_SECRET = "otp-secret";

      userRepo.findByEmail.mockResolvedValue({
        id: "u1",
        email: "a@gmail.com",
        name: "A",
      });
      (jwt.sign as jest.Mock).mockReturnValue("OTP_TOKEN");
      (bcrypt.hash as jest.Mock).mockResolvedValue("OTP_HASH");

      const result = await accessService.forgotPassword({
        email: "a@gmail.com",
      });

      expect(jwt.sign).toHaveBeenCalled();
      expect(mailService.sendPasswordResetOtpEmail).toHaveBeenCalledWith({
        to: "a@gmail.com",
        customerName: "A",
        otp: expect.any(String),
      });
      expect(result).toEqual({
        sent: true,
        message: "If this email exists, an OTP has been sent",
        otpToken: "OTP_TOKEN",
      });
    });
  });

  describe("verifyForgotPasswordOtp()", () => {
    it("should throw if otpToken or otp missing", async () => {
      await expect(
        accessService.verifyForgotPasswordOtp({ otpToken: "", otp: "123456" }),
      ).rejects.toBeInstanceOf(BadRequestError);
    });

    it("should throw when otpToken invalid", async () => {
      process.env.PASSWORD_RESET_OTP_SECRET = "otp-secret";
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("invalid");
      });

      await expect(
        accessService.verifyForgotPasswordOtp({
          otpToken: "bad-token",
          otp: "123456",
        }),
      ).rejects.toBeInstanceOf(BadRequestError);
    });

    it("should throw when otp is wrong", async () => {
      process.env.PASSWORD_RESET_OTP_SECRET = "otp-secret";
      (jwt.verify as jest.Mock).mockReturnValue({
        userId: "u1",
        email: "a@gmail.com",
        otpHash: "OTP_HASH",
        purpose: "password-otp",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        accessService.verifyForgotPasswordOtp({
          otpToken: "otp-token",
          otp: "000000",
        }),
      ).rejects.toBeInstanceOf(BadRequestError);
    });

    it("should verify OTP and return resetToken", async () => {
      process.env.PASSWORD_RESET_OTP_SECRET = "otp-secret";
      process.env.PASSWORD_RESET_SECRET = "reset-secret";
      (jwt.verify as jest.Mock).mockReturnValue({
        userId: "u1",
        email: "a@gmail.com",
        otpHash: "OTP_HASH",
        purpose: "password-otp",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("RESET_TOKEN");

      const result = await accessService.verifyForgotPasswordOtp({
        otpToken: "otp-token",
        otp: "123456",
      });

      expect(result).toEqual({
        verified: true,
        resetToken: "RESET_TOKEN",
      });
    });
  });

  describe("resetPassword()", () => {
    it("should throw when required fields are missing", async () => {
      await expect(
        accessService.resetPassword({
          token: "",
          newPassword: "123",
          confirmNewPassword: "123",
        }),
      ).rejects.toBeInstanceOf(BadRequestError);
    });

    it("should throw when password confirmation mismatch", async () => {
      await expect(
        accessService.resetPassword({
          token: "token",
          newPassword: "123",
          confirmNewPassword: "456",
        }),
      ).rejects.toBeInstanceOf(BadRequestError);
    });

    it("should throw when token invalid", async () => {
      process.env.PASSWORD_RESET_SECRET = "secret";
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("invalid");
      });

      await expect(
        accessService.resetPassword({
          token: "bad-token",
          newPassword: "123456",
          confirmNewPassword: "123456",
        }),
      ).rejects.toBeInstanceOf(BadRequestError);
    });

    it("should reset password successfully", async () => {
      process.env.PASSWORD_RESET_SECRET = "secret";
      (jwt.verify as jest.Mock).mockReturnValue({
        userId: "u1",
        purpose: "password-reset",
      });
      userRepo.findByIdWithPassword.mockResolvedValue({
        id: "u1",
        password: "OLD_HASH",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      (bcrypt.hash as jest.Mock).mockResolvedValue("NEW_HASH");
      userRepo.updatePassword.mockResolvedValue({ id: "u1" });
      keyRepo.deleteTokenByUserId.mockResolvedValue(true);

      const result = await accessService.resetPassword({
        token: "valid-token",
        newPassword: "New@123456",
        confirmNewPassword: "New@123456",
      });

      expect(userRepo.updatePassword).toHaveBeenCalledWith("u1", "NEW_HASH");
      expect(keyRepo.deleteTokenByUserId).toHaveBeenCalledWith("u1");
      expect(result).toEqual({ reset: true, userId: "u1" });
    });
  });
});
