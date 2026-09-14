import { Response } from 'express';
import { hashPassword, comparePassword } from '../utils/password';
import { userRepository } from '../repositories/userRepository';
import { refreshTokenRepository } from '../repositories/refreshTokenRepository';
import { generateAccessToken, generateRefreshToken, JWTPayload } from '../utils/jwt';

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
    return {
      user: { id: user.id, email: user.email, name: user.name },
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken(payload)
    };
  },

  login: async (data: { email: string; password: string }) => {
    const user = await userRepository.findByEmail(data.email);

    if (!user || !(await comparePassword(data.password, user.passwordHash))) {
      throw new Error('Invalid credentials');
    }

    const payload: JWTPayload = { userId: user.id, email: user.email };
    return {
      user: { id: user.id, email: user.email, name: user.name },
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken(payload)
    };
  },

  refreshTokens: async (refreshToken: string) => {
    const payload = require('../utils/jwt').decodeRefreshToken(refreshToken);
    if (!payload) {
      throw new Error('Invalid refresh token');
    }

    const token = await refreshTokenRepository.findByTokenHash(
      await require('../utils/password').hashToken(refreshToken)
    );

    if (!token || token.revokedAt || token.expiresAt < new Date()) {
      throw new Error('Invalid refresh token');
    }

    await refreshTokenRepository.revoke(token.id);
    const user = await userRepository.findById(payload.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const newPayload: JWTPayload = { userId: user.id, email: user.email };
    return {
      accessToken: generateAccessToken(newPayload),
      refreshToken: generateRefreshToken(newPayload)
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
