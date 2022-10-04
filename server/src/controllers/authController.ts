import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { userService } from '@/services/userService';
import { authService } from '@/services/authService';
import { GoogleTokens, GoogleUser, ReqWithSessionValues } from '@/interfaces';

class AuthController {
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

  async me(req: ReqWithSessionValues, res: Response, next: NextFunction): Promise<void> {
    try {
      const findUser = await userService.findById(req.userId);
      res.status(200).json({ ...findUser, signAccess: req.access_token });
    } catch (error) {
      next(error);
    }
  }

  async logOut(req: ReqWithSessionValues, res: Response): Promise<void> {
    try {
      await authService.logout(req.userId);
      res.cookie('refresh_token', '', { maxAge: 0, httpOnly: true, sameSite: 'strict' });
      res.status(200).json('success logout');
    } catch (error) {
      res.status(error.status).json({ status: error.satus, message: error.message });
    }
  }
}

export const authController = new AuthController();
