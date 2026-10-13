import jwt from 'jsonwebtoken';
import { UserRole } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'medicore_super_secret_jwt_key_2026_demo';

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
