import bcrypt from "bcrypt";
import { AuthFailureError, BadRequestError } from "../core/error.response";
import crypto from "crypto";
import { createTokenPair } from "../auth/authUtils";
import KeyTokenService from "../services/keyToken.service";
import { IUserRepository } from "../interface/user.repository.interface";
import { IKeyTokenRepository } from "../interface/keyToken.repository.interface";
import { NextFunction } from "express";

export default class AccessService {
  constructor(
    private userRepo: IUserRepository,
    private keyRepo: IKeyTokenRepository,
    private keyTokenService: KeyTokenService,
  ) {}

  async login(data: { email: string; password: string }) {
    const { email, password } = data;

    const foundUser = await this.userRepo.findByEmail(email);
    if (!foundUser) throw new BadRequestError("User not registered");

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) throw new BadRequestError("Password is incorrect");

    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    const tokens = await createTokenPair(
      { userId: foundUser.id, email: foundUser.email, role: foundUser.role },
      publicKey,
      privateKey,
    );

    await this.keyTokenService.createKeyToken(
      foundUser.id,
      publicKey,
      privateKey,
      tokens.refreshToken,
    );

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

  async signUp(data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) {
    const { email, password, name, phone } = data;

    const foundUser = await this.userRepo.findByEmail(email);
    if (foundUser) throw new BadRequestError("Email already exists");

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await this.userRepo.createUser({
      name,
      email,
      password: passwordHash,
      phone,
    });

    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    const tokens = await createTokenPair(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      publicKey,
      privateKey,
    );

    await this.keyTokenService.createKeyToken(
      newUser.id,
      publicKey,
      privateKey,
      tokens.refreshToken,
    );

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phoneNumber,
        role: newUser.role,
      },
      tokens,
    };
  }

  async logout({ userId }: { userId: string }) {
    return this.keyRepo.deleteTokenByUserId(userId);
  }

  async handleRefreshToken(data: {
    refreshToken: string;
    userId: string;
    email: string;
  }) {
    const { refreshToken, userId } = data;

    const key = await this.keyRepo.findByUserId(userId);
    if (!key) throw new BadRequestError("Invalid refresh token");

    if (key.refreshTokensUsed.includes(refreshToken)) {
      await this.keyRepo.deleteTokenByUserId(userId);
      throw new BadRequestError("Something wrong happened. Please login again");
    }

    if (key.refreshToken !== refreshToken) {
      throw new BadRequestError("Invalid refresh token");
    }

    const foundUser = await this.userRepo.findById(userId);
    if (!foundUser) throw new BadRequestError("User not registered");

    const tokens = await createTokenPair(
      { userId: foundUser.id, email: foundUser.email, role: foundUser.role },
      key.publicKey,
      key.privateKey,
    );

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
