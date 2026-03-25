import JWT from 'jsonwebtoken';
import { asyncHandler } from '../helper/asyncHandler';
import {
  AuthFailureError,
  BadRequestError,
  NotFoundError,
} from '../core/error.response';
import { prisma } from '../lib/prisma';
import { NextFunction, Request, Response } from 'express';
const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESHTOKEN: 'x-refresh-token',
} as const;

const normalizeToken = (token?: string) => {
  if (!token) return '';
  return token.startsWith('Bearer ') ? token.slice(7).trim() : token;
};

export const authentication = asyncHandler(async (req: Request, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new NotFoundError('User not found');

  const keyStore = await prisma.key.findUnique({
    where: { userId: String(userId) },
  });
  if (!keyStore) {
    throw new NotFoundError('Key store not found');
  }
  const rawRefreshToken = req.headers[HEADER.REFRESHTOKEN] as string;
  const refreshToken = normalizeToken(rawRefreshToken);
  if (refreshToken) {
    try {
      const decodeUser = JWT.verify(
        refreshToken,
        keyStore.publicKey,
      ) as JWT.JwtPayload;
      console.log('Decoded user from refresh token:', decodeUser);
      if (String(userId) !== String(decodeUser.userId)) {
        throw new AuthFailureError('Invalid user');
      }
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw new AuthFailureError('Invalid or expired refresh token');
    }
  }
  const rawAccessToken = req.headers[HEADER.AUTHORIZATION] as string;
  const accessToken = normalizeToken(rawAccessToken);
  if (!accessToken) {
    throw new BadRequestError('No token provided');
  }
  try {
    const decodeUser = JWT.verify(
      accessToken,
      keyStore.publicKey,
    ) as JWT.JwtPayload;
    if (String(userId) !== String(decodeUser.userId)) {
      throw new AuthFailureError('Invalid user');
    }
    req.keyStore = keyStore;
    req.user = decodeUser;
    return next();
  } catch (error) {
    throw new AuthFailureError('Invalid or expired access token');
  }
});

export const createTokenPair = async (
  payload: object,
  publicKey: string,
  privateKey: string,
) => {
  try {
    //access token
    const accessToken = JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '2 days',
    });

    //refresh token
    const refreshToken = JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '7 days',
    });

    JWT.verify(accessToken, publicKey);
    JWT.verify(refreshToken, publicKey);

    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !roles.includes(userRole)) {
      throw new AuthFailureError('You are not allowed to access this resource');
    }
    next();
  };
};
