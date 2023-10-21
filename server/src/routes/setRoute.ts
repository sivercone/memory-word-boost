import { Router } from 'express';
import { setController } from '@src/controllers';
import { Routes } from '@src/interfaces';
import { isAuth } from '@src/middlewares';

class SetRoute implements Routes {
  public path = '/set';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}s`, setController.getSets);
    this.router.get(`${this.path}/:id`, setController.getSetById);
    this.router.get(`${this.path}/byuser/:id`, setController.getSetByUser);
    this.router.post(`${this.path}`, isAuth, setController.createSet);
    this.router.put(`${this.path}`, isAuth, setController.updateSet);
    this.router.delete(`${this.path}/:id`, isAuth, setController.deleteSet);
  }
}

export default SetRoute;
