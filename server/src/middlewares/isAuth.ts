import express from 'express';
import jwt from 'jsonwebtoken';
import { authService } from '@services/authService';
import { logger } from '@utils/logger';
import { HttpException } from '@utils/HttpException';
import { ReqWithSessionValues } from '@/interfaces';

export const isAuth = async (req: ReqWithSessionValues, res: express.Response, next: express.NextFunction) => {
  try {
    const accessToken: string | undefined = req.headers['authorization']?.split(' ')[1];
    const refreshToken: string | undefined = req.cookies['refresh_token'];

    if (!refreshToken) {
      res.status(401).json({ status: 401, message: 'Unauthorized. Your session has expired.' });
    } else {
      jwt.verify(accessToken, process.env.ACCESS_SECRET, (err, decoded: { userId: string }) => {
        if (err) {
          jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (err) => {
            if (err) {
              res.status(401).json({ status: 401, message: 'Unauthorized. Your session has expired.' });
            } else {
              try {
                const { refresh_token, access_token, decodedUserId } = await authService.findToken(refreshToken);
                req.access_token = access_token;
                req.refresh_token = refresh_token;
                req.userId = decodedUserId;
                res.cookie('refresh_token', req.refresh_token, { maxAge: 24 * 60 * 3600000, httpOnly: true, sameSite: 'strict' });
                next();
              } catch (error) {
                logger.error(error);
                res.cookie('refresh_token', '', { maxAge: 0, httpOnly: true, sameSite: 'strict' });
                res.status(error.status).json({ status: error.status, message: error.message });
              }
            }
          });
        } else {
          if (!decoded.userId) res.status(401).json({ status: 401, message: 'Unauthorized. Your session has expired.' });
          else {
            req.userId = decoded.userId;
            req.access_token = accessToken;
            next();
          }
        }
      });
    }
  } catch (error) {
    logger.error(error);
    next(new HttpException(500, 'Server error'));
  }
};
