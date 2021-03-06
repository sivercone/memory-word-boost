import { Router } from 'express';
import { setController } from '@controllers/setController';
import { Routes } from '@/interfaces';

class SetRoute implements Routes {
  public path = '/set';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}s`, setController.getSets);
    this.router.get(`${this.path}/:id`, setController.getSetById);
    this.router.post(`${this.path}/byuser`, setController.getSetByUser);
    this.router.post(`${this.path}`, setController.createSet);
    this.router.put(`${this.path}`, setController.updateSet);
    this.router.delete(`${this.path}/:id`, setController.deleteSet);
  }
}

export default SetRoute;
