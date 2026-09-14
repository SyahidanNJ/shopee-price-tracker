import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface JWTPayload {
  userId: string;
  email: string;
}

export const generateAccessToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, config.jwtAccessSecret!, {
    expiresIn: config.jwtAccessExpiresIn
  });
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, config.jwtRefreshSecret!, {
    expiresIn: config.jwtRefreshExpiresIn
  });
};

export const verifyToken = (token: string, secret: string): JWTPayload => {
  return jwt.verify(token, secret) as JWTPayload;
};

export const decodeRefreshToken = (token: string): JWTPayload | null => {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
};
