import { Response } from 'express';
import { createHash } from 'crypto';
import { hashPassword, comparePassword } from '../utils/password';
import { userRepository } from '../repositories/userRepository';
import { refreshTokenRepository } from '../repositories/refreshTokenRepository';
import { generateAccessToken, generateRefreshToken, verifyToken, decodeRefreshToken, JWTPayload } from '../utils/jwt';
import { config } from '../config';

const hashToken = (token: string): string => {
  return createHash('sha256').update(token).digest('hex');
};

const getRefreshExpiry = (): Date => {
  const days = parseInt(config.jwtRefreshExpiresIn) || 7;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
};

export const authService = {
  register: async (data: { email: string; password: string; name: string }) => {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const passwordHash = await hashPassword(data.password);
    const user = await userRepository.create({
      email: data.email,
      passwordHash,
      name: data.name
    });

    const payload: JWTPayload = { userId: user.id, email: user.email };
    const refreshToken = generateRefreshToken(payload);

    await refreshTokenRepository.create({
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: getRefreshExpiry()
    });

    return {
      user: { id: user.id, email: user.email, name: user.name },
      accessToken: generateAccessToken(payload),
      refreshToken
    };
  },

  login: async (data: { email: string; password: string }) => {
    const user = await userRepository.findByEmail(data.email);

    // Same error message whether email or password is wrong (no enumeration)
    if (!user || !(await comparePassword(data.password, user.passwordHash))) {
      throw new Error('Invalid credentials');
    }

    const payload: JWTPayload = { userId: user.id, email: user.email };
    const refreshToken = generateRefreshToken(payload);

    await refreshTokenRepository.create({
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: getRefreshExpiry()
    });

    return {
      user: { id: user.id, email: user.email, name: user.name },
      accessToken: generateAccessToken(payload),
      refreshToken
    };
  },

  refreshTokens: async (refreshToken: string) => {
    const payload = decodeRefreshToken(refreshToken);
    if (!payload) {
      throw new Error('Invalid refresh token');
    }

    const token = await refreshTokenRepository.findByTokenHash(hashToken(refreshToken));

    if (!token || token.revokedAt || token.expiresAt < new Date()) {
      throw new Error('Invalid refresh token');
    }

    // Rotate: revoke old, issue new
    await refreshTokenRepository.revoke(token.id);

    const user = await userRepository.findById(payload.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const newPayload: JWTPayload = { userId: user.id, email: user.email };
    const newRefreshToken = generateRefreshToken(newPayload);

    await refreshTokenRepository.create({
      userId: user.id,
      tokenHash: hashToken(newRefreshToken),
      expiresAt: getRefreshExpiry()
    });

    return {
      accessToken: generateAccessToken(newPayload),
      refreshToken: newRefreshToken
    };
  },

  logout: async (userId: string) => {
    await refreshTokenRepository.revokeByUserId(userId);
  },

  getCurrentUser: async (userId: string) => {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return { id: user.id, email: user.email, name: user.name };
  }
};
