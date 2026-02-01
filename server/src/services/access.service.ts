import { BadRequestError } from "../core/error.response";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { createTokenPair } from "../auth/authUtils";
import KeyTokenService from "./keyToken.service";
class AccessService {
  static handleRefreshToken = async (data: any) => {
    const { refreshToken, userId, email, key } = data;
    if (key.refreshTokensUsed.includes(refreshToken)) {
      await prisma.key.delete({ where: { userId: userId } });
      throw new BadRequestError("Something wrong happened. Please login again");
    }
    if (key.refreshToken !== refreshToken) {
      throw new BadRequestError("Invalid refresh token");
    }
    const foundUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!foundUser) {
      throw new BadRequestError("User not registered");
    }
    const tokens = await createTokenPair(
      { userId: foundUser.id, email: foundUser.email },
      key.publicKey,
      key.privateKey
    );
    await prisma.key.update({
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
  };
  static logout = async (data: any) => {
    const { userId } = data;
    const result = prisma.key.delete({ where: { userId: userId } });
    return result;
  };
  static login = async (data: any): Promise<{}> => {
    const { email, password } = data;
    const foundUser = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!foundUser) {
      throw new BadRequestError("User not registered");
    }

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      throw new BadRequestError("Password is incorrect");
    }
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
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
    const tokens = await createTokenPair(
      { userId: foundUser.id, email: foundUser.email },
      publicKey,
      privateKey
    );
    await KeyTokenService.createKeyToken(
      foundUser.id,
      publicKey,
      privateKey,
      tokens.refreshToken
    );
    return {
      User: {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
      },
      tokens: tokens,
    };
  };
  static signUp = async (data: any): Promise<{}> => {
    const { email, password, name, phone } = data;
    const foundUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (foundUser) {
      throw new BadRequestError("Email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: passwordHash,
        phoneNumber: phone,
        role: "USER",
      },
    });
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
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

    const tokens = await createTokenPair(
      { userId: newUser.id, email: newUser.email },
      publicKey,
      privateKey
    );

    const keyStore = await KeyTokenService.createKeyToken(
      newUser.id,
      publicKey,
      privateKey,
      tokens.refreshToken
    );

    if (!keyStore) {
      throw new BadRequestError("User already exists");
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
  };
}

export default AccessService;
