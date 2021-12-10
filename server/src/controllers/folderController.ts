import { NextFunction, Request, Response } from 'express';
import { folderService } from '@/services/folderService';

class FolderController {
  public getFolders = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const data = await folderService.findAll();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  public createFolder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      await folderService.create(payload);
      res.status(201).json('success');
    } catch (error) {
      next(error);
    }
  };

  public updateFolder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      await folderService.update(payload);
      res.status(200).json('success');
    } catch (error) {
      next(error);
    }
  };

  public deleteFolder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.params.id;
      await folderService.delete(payload);
      res.status(200).json({ message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export const folderController = new FolderController();
