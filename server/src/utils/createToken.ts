import { sign } from 'jsonwebtoken';

export const createAccessToken = (userId: string) => {
  return sign({ userId }, process.env.ACCESS_SECRET, { expiresIn: '30m', algorithm: 'HS256' });
};

export const createRefreshToken = (userId: string) => {
  return sign({ userId }, process.env.REFRESH_SECRET, { expiresIn: '14d', algorithm: 'HS256' });
};
