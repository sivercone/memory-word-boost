import { NextFunction, Request, Response } from 'express';
import { folderService } from '@/services/folderService';
import { ReqWithSessionValues } from '@/interfaces';

class FolderController {
  public getFolders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { excludeUserId } = req.query;
      const data = await folderService.findAll(typeof excludeUserId === 'string' ? excludeUserId : undefined);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  public getFolderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.params.id;
      const data = await folderService.findById(payload);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  public getFolderByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      const data = await folderService.findByUser(payload);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  public createFolder = async (req: ReqWithSessionValues, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      const data = await folderService.create(payload);
      res.status(201).json(data.id);
    } catch (error) {
      next(error);
    }
  };

  public updateFolder = async (req: ReqWithSessionValues, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      const data = await folderService.update(payload, req.userId);
      res.status(200).json(data.id);
    } catch (error) {
      next(error);
    }
  };

  public deleteFolder = async (req: ReqWithSessionValues, res: Response, next: NextFunction) => {
    try {
      const payload = req.params.id;
      await folderService.delete(payload, req.userId);
      res.status(200).json({ message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export const folderController = new FolderController();
