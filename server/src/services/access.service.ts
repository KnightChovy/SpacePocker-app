import bcrypt from 'bcrypt';
import { AuthFailureError, BadRequestError } from '../core/error.response';

import crypto from 'crypto';
import { createTokenPair } from '../auth/authUtils';
import KeyTokenService from '../services/keyToken.service';
import { IUserRepository } from '../interface/user.repository.interface';
import { IKeyTokenRepository } from '../interface/keyToken.repository.interface';
import { NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import MailService from './mail.service';

type OtpTokenPayload = {
  userId: string;
  email: string;
  otpHash: string;
  purpose: 'password-otp';
};

type ResetTokenPayload = {
  userId: string;
  email: string;
  purpose: 'password-reset';
};

export default class AccessService {
  constructor(
    private userRepo: IUserRepository,
    private keyRepo: IKeyTokenRepository,
    private keyTokenService: KeyTokenService,
    private mailService: MailService,
  ) {}

  private resolveSecret(
    candidates: Array<string | undefined>,
    requiredEnvName: string,
    devFallback: string,
  ) {
    const found = candidates.find((value) => Boolean(value));
    if (found) {
      return found;
    }

    if (process.env.NODE_ENV === 'production') {
      throw new BadRequestError(`${requiredEnvName} is missing`);
    }

    return devFallback;
  }

  async login(data: { email: string; password: string }) {
    const { email, password } = data;

    const foundUser = await this.userRepo.findByEmail(email);
    if (!foundUser) throw new BadRequestError('User not registered');

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) throw new BadRequestError('Password is incorrect');

    // Check if keys already exist for this user
    let existingKey = await this.keyRepo.findByUserId(foundUser.id);
    let publicKey: string;
    let privateKey: string;

    if (existingKey && existingKey.publicKey && existingKey.privateKey) {
      // Reuse existing keys
      publicKey = existingKey.publicKey;
      privateKey = existingKey.privateKey;
    } else {
      // Generate new keys only if they don't exist
      const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      });
      publicKey = keyPair.publicKey;
      privateKey = keyPair.privateKey;
    }

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
        phone: foundUser.phoneNumber,
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
    if (foundUser) throw new BadRequestError('Email already exists');

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await this.userRepo.createUser({
      name,
      email,
      password: passwordHash,
      phone,
    });

    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
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
    if (!key) throw new BadRequestError('Invalid refresh token');

    if (key.refreshTokensUsed.includes(refreshToken)) {
      await this.keyRepo.deleteTokenByUserId(userId);
      throw new BadRequestError('Something wrong happened. Please login again');
    }

    if (key.refreshToken !== refreshToken) {
      throw new BadRequestError('Invalid refresh token');
    }

    const foundUser = await this.userRepo.findById(userId);
    if (!foundUser) throw new BadRequestError('User not registered');

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
        phone: foundUser.phoneNumber,
      },
      tokens,
    };
  }

  async forgotPassword(data: { email: string }) {
    const email = data.email?.trim().toLowerCase();
    if (!email) {
      throw new BadRequestError('Email is required');
    }

    const foundUser = await this.userRepo.findByEmail(email);

    if (foundUser) {
      const otpSecret = this.resolveSecret(
        [
          process.env.PASSWORD_RESET_OTP_SECRET,
          process.env.PASSWORD_RESET_SECRET,
          process.env.JWT_SECRET,
        ],
        'PASSWORD_RESET_OTP_SECRET',
        'dev-password-reset-otp-secret',
      );

      const otp = String(Math.floor(100000 + Math.random() * 900000));
      const otpHash = await bcrypt.hash(otp, 10);
      const otpExpiresIn = (process.env.PASSWORD_RESET_OTP_EXPIRES_IN ||
        '10m') as SignOptions['expiresIn'];
      const otpToken = jwt.sign(
        {
          userId: foundUser.id,
          email: foundUser.email,
          otpHash,
          purpose: 'password-otp',
        },
        otpSecret,
        { expiresIn: otpExpiresIn },
      );

      await this.mailService.sendPasswordResetOtpEmail({
        to: foundUser.email,
        customerName: foundUser.name,
        otp,
      });

      return {
        sent: true,
        message: 'If this email exists, an OTP has been sent',
        otpToken,
      };
    }

    return {
      sent: true,
      message: 'If this email exists, an OTP has been sent',
    };
  }

  async verifyForgotPasswordOtp(data: { otpToken: string; otp: string }) {
    const { otpToken, otp } = data;

    if (!otpToken || !otp) {
      throw new BadRequestError('otpToken and otp are required');
    }

    const otpSecret = this.resolveSecret(
      [
        process.env.PASSWORD_RESET_OTP_SECRET,
        process.env.PASSWORD_RESET_SECRET,
        process.env.JWT_SECRET,
      ],
      'PASSWORD_RESET_OTP_SECRET',
      'dev-password-reset-otp-secret',
    );

    let payload: OtpTokenPayload;
    try {
      payload = jwt.verify(otpToken, otpSecret) as OtpTokenPayload;
    } catch {
      throw new BadRequestError('Invalid or expired OTP token');
    }

    if (
      !payload?.userId ||
      payload?.purpose !== 'password-otp' ||
      !payload?.otpHash
    ) {
      throw new BadRequestError('Invalid OTP token payload');
    }

    const isOtpValid = await bcrypt.compare(String(otp), payload.otpHash);
    if (!isOtpValid) {
      throw new BadRequestError('OTP is invalid');
    }

    const resetSecret = this.resolveSecret(
      [process.env.PASSWORD_RESET_SECRET, process.env.JWT_SECRET],
      'PASSWORD_RESET_SECRET',
      'dev-password-reset-secret',
    );

    const resetTokenExpiresIn = (process.env.PASSWORD_RESET_EXPIRES_IN ||
      '15m') as SignOptions['expiresIn'];
    const resetToken = jwt.sign(
      {
        userId: payload.userId,
        email: payload.email,
        purpose: 'password-reset',
      },
      resetSecret,
      { expiresIn: resetTokenExpiresIn },
    );

    return {
      verified: true,
      resetToken,
    };
  }

  async resetPassword(data: {
    token: string;
    newPassword: string;
    confirmNewPassword: string;
  }) {
    const { token, newPassword, confirmNewPassword } = data;

    if (!token || !newPassword || !confirmNewPassword) {
      throw new BadRequestError(
        'token, newPassword and confirmNewPassword are required',
      );
    }

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestError(
        'New password and confirm password do not match',
      );
    }

    const resetSecret = this.resolveSecret(
      [process.env.PASSWORD_RESET_SECRET, process.env.JWT_SECRET],
      'PASSWORD_RESET_SECRET',
      'dev-password-reset-secret',
    );

    let payload: ResetTokenPayload;
    try {
      payload = jwt.verify(token, resetSecret) as ResetTokenPayload;
    } catch {
      throw new BadRequestError('Invalid or expired reset token');
    }

    if (!payload?.userId || payload?.purpose !== 'password-reset') {
      throw new BadRequestError('Invalid reset token payload');
    }

    const foundUser = await this.userRepo.findByIdWithPassword(
      String(payload.userId),
    );
    if (!foundUser) {
      throw new BadRequestError('User not registered');
    }

    const isSamePassword = await bcrypt.compare(
      newPassword,
      foundUser.password,
    );
    if (isSamePassword) {
      throw new BadRequestError(
        'New password must be different from current password',
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.userRepo.updatePassword(foundUser.id, passwordHash);
    await this.keyRepo.deleteTokenByUserId(foundUser.id);

    return {
      reset: true,
      userId: foundUser.id,
    };
  }
}
