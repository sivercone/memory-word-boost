import { Router } from 'express';
import { folderController } from '@src/controllers';
import { Routes } from '@src/interfaces';
import { isAuth } from '@src/middlewares';

class FolderRoute implements Routes {
  public path = '/folder';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}s`, folderController.getFolders);
    this.router.get(`${this.path}/:id`, folderController.getFolderById);
    this.router.get(`${this.path}/byuser/:id`, folderController.getFolderByUser);
    this.router.post(`${this.path}`, isAuth, folderController.createFolder);
    this.router.put(`${this.path}`, isAuth, folderController.updateFolder);
    this.router.delete(`${this.path}/:id`, isAuth, folderController.deleteFolder);
  }
}

export default FolderRoute;
