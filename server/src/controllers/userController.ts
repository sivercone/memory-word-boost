import { Request, Response, NextFunction } from 'express';
import { userService } from '@/services/userService';
import { ReqWithSessionValues } from '@/interfaces';

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

  public updateUser = async (req: ReqWithSessionValues, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      if (payload.id !== req.userId) res.status(401).json({ status: 403, message: 'Forbidden' });
      else {
        await userService.update(payload);
        res.status(200).json({ message: 'updated' });
      }
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: ReqWithSessionValues, res: Response, next: NextFunction) => {
    try {
      const payload = req.params.id;
      if (payload !== req.userId) res.status(401).json({ status: 403, message: 'Forbidden' });
      else {
        await userService.delete(payload);
        res.status(200).json({ message: 'deleted' });
      }
    } catch (error) {
      next(error);
    }
  };
}

export const userController = new UserController();
