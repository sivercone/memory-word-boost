import { NextFunction, Request, Response } from 'express';
import { setService } from '@/services/setService';

class SetController {
  public getSets = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const data = await setService.findAll();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  public getSetById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.params.id;
      const data = await setService.findById(payload);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  public createSet = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      console.log('result - 1', payload);
      await setService.create(payload);
      res.status(201).json({ message: 'created' });
    } catch (error) {
      next(error);
    }
  };
}

export const setController = new SetController();
