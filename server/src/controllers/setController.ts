import { NextFunction, Request, Response } from 'express';
import { setService } from '@/services/setService';
import { ReqWithSessionValues } from '@/interfaces';

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

  public getSetByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      const data = await setService.findByUser(payload);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  public createSet = async (req: ReqWithSessionValues, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      const data = await setService.create(payload);
      res.status(201).json(data.id);
    } catch (error) {
      next(error);
    }
  };

  public updateSet = async (req: ReqWithSessionValues, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      const data = await setService.update(payload, req.userId);
      res.status(200).json(data.id);
    } catch (error) {
      next(error);
    }
  };

  public deleteSet = async (req: ReqWithSessionValues, res: Response, next: NextFunction) => {
    try {
      const payload = req.params.id;
      await setService.delete(payload, req.userId);
      res.status(200).json({ message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export const setController = new SetController();
