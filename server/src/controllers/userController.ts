import { Request, Response, NextFunction } from 'express';
import { userService } from '@/services/userService';

class UserController {
  public getUsers = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const data = await userService.findAll();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.params.id;
      const data = await userService.findById(payload);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

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

export const userController = new UserController();
