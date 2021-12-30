import express from 'express';
import jwt from 'jsonwebtoken';
// import { MyRequest } from '@/interfaces';
import { authService } from '@services/authService';
import { logger } from '@utils/logger';
import { HttpException } from '@utils/HttpException';

export interface RequestWithTokens extends express.Request {
  access_token?: string;
  refresh_token?: string;
  userId?: string;
}

export const isAuth = async (req: RequestWithTokens, res: express.Response, next: express.NextFunction) => {
  try {
    const authorization: string | undefined = req.headers['authorization'];
    const accessToken: string = authorization ? authorization.split(' ')[1] : 'undefined';
    const refreshToken: string | undefined = req.cookies['refresh_token'];

    if (!refreshToken) {
      res.status(401).json({ status: 401, error: 'Unauthorized.' });
    } else {
      jwt.verify(accessToken, process.env.ACCESS_SECRET, (err, decoded: any) => {
        if (err) {
          jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (err) => {
            if (err) {
              res.status(401).json({ status: 401, error: 'Unauthorized.' });
            } else {
              try {
                const { refresh_token, access_token, decodedUserId } = await authService.findToken(refreshToken);
                req.access_token = access_token;
                req.refresh_token = refresh_token;
                req.userId = decodedUserId;
                next();
              } catch (error) {
                logger.error(error);
                res.cookie('refresh_token', '', { maxAge: 0, httpOnly: true, sameSite: 'strict' });
                res.status(error.status).json({ status: error.status, error: error.message });
              }
            }
          });
        } else {
          req.userId = decoded.userId;
          req.access_token = accessToken;
          next();
        }
      });
    }
  } catch (error) {
    logger.error(error);
    next(new HttpException(500, 'Server error'));
  }
};
