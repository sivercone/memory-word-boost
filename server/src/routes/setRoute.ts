import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { setController } from '@controllers/setController';

export class setRoute implements Routes {
  public path = '/set';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, setController.getSets);
    this.router.get(`${this.path}/:id`, setController.getSetById);
    this.router.post(`${this.path}`, setController.createSet);
    this.router.delete(`${this.path}/:id`, setController.deleteSet);
  }
}
