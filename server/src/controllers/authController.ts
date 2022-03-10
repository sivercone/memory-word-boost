import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { userService } from '@/services/userService';
import { authService } from '@/services/authService';
import { RequestWithTokens } from '@/middlewares/isAuth';

interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

interface GoogleTokens {
  access_token: string;
  expires_in: Number;
  refresh_token: string;
  scope: string;
  id_token: string;
}

class AuthController {
  public getUsers = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const data = await userService.findAll();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  async ouathGoogle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { access_token, id_token } = await axios
        .post<GoogleTokens>('https://oauth2.googleapis.com/token', {
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          code: req.query.code,
          grant_type: 'authorization_code',
          redirect_uri: 'http://localhost:7001/auth/google',
        })
        .then((res) => res.data);
      const { email, name, picture } = await axios
        .get<GoogleUser>(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
          headers: { Authorization: `Bearer ${id_token}` },
        })
        .then((res) => res.data);
      const token = await authService.logIn({ email, name, avatar: picture });
      res.cookie('refresh_token', token, { maxAge: 24 * 60 * 3600000, httpOnly: true, sameSite: 'strict' });
      res.redirect('http://localhost:3000');
    } catch (error) {
      next(error);
    }
  }

  async me(req: RequestWithTokens, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) res.status(403).json({ status: 403, message: 'Forbidden' });
      if (req.refresh_token)
        res.cookie('refresh_token', req.refresh_token, { maxAge: 24 * 60 * 3600000, httpOnly: true, sameSite: 'strict' });

      const findUser = await userService.findById(req.userId);
      res.status(200).json(findUser);
    } catch (error) {
      next(error);
    }
  }

  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      await userService.update(payload);
      res.status(200).json({ message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.params.id;
      await userService.delete(payload);
      res.status(200).json({ message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
