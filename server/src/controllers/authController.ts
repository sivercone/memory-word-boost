import { Request, Response, NextFunction } from 'express';
import { userService } from '@/services/userService';
import { authService } from '@/services/authService';
import { ReqWithSessionValues } from '@/interfaces';

class AuthController {
  async logIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const tokens = await authService.logIn({ email, password });
      res.cookie('access_token', tokens.access, { maxAge: 24 * 60 * 3600000, httpOnly: true, sameSite: 'strict' });
      res.cookie('refresh_token', tokens.refresh, { maxAge: 24 * 60 * 3600000, httpOnly: true, sameSite: 'strict' });
      res.status(200).json('success');
    } catch (error) {
      next(error);
    }
  }

  async me(req: ReqWithSessionValues, res: Response, next: NextFunction): Promise<void> {
    try {
      const findUser = await userService.findById(req.userId);
      res.cookie('access_token', req.access_token, { maxAge: 24 * 60 * 3600000, httpOnly: true, sameSite: 'strict' });
      res.status(200).json(findUser);
    } catch (error) {
      next(error);
    }
  }

  async logOut(req: ReqWithSessionValues, res: Response): Promise<void> {
    try {
      await authService.logout(req.userId);
      res.cookie('refresh_token', '', { maxAge: 0, httpOnly: true, sameSite: 'strict' });
      res.cookie('access_token', '', { maxAge: 0, httpOnly: true, sameSite: 'strict' });
      res.status(200).json('success logout');
    } catch (error) {
      res.status(error.status).json({ status: error.satus, message: error.message });
    }
  }
}

export const authController = new AuthController();
