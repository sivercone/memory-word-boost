import { Router } from 'express';
import { folderController } from '@/controllers/folderController';
import { Routes } from '@/interfaces';

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
    this.router.post(`${this.path}`, folderController.createFolder);
    this.router.put(`${this.path}`, folderController.updateFolder);
    this.router.delete(`${this.path}/:id`, folderController.deleteFolder);
  }
}

export default FolderRoute;
