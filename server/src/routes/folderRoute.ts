import { Router } from 'express';
import { folderController } from '@/controllers/folderController';
import { Routes } from '@/interfaces';
import { isAuth } from '@/middlewares/isAuth';

class FolderRoute implements Routes {
  public path = '/folder';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}s`, folderController.getFolders);
    this.router.get(`${this.path}/:id`, folderController.getFolderById);
    this.router.post(`${this.path}/byuser`, folderController.getFolderByUser);
    this.router.post(`${this.path}`, isAuth, folderController.createFolder);
    this.router.put(`${this.path}`, isAuth, folderController.updateFolder);
    this.router.delete(`${this.path}/:id`, isAuth, folderController.deleteFolder);
  }
}

export default FolderRoute;
