import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { authController } from '@/controllers/authController';
import { isAuth } from '@/middlewares/isAuth';
import { userController } from '@/controllers/userController';

class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/google`, authController.ouathGoogle);
    this.router.get(`${this.path}/me`, isAuth, authController.me);
    this.router.get(`${this.path}/users`, userController.getUsers);
    this.router.get(`${this.path}/user/:id`, userController.getUserById);
    this.router.put(`${this.path}/user/update`, userController.updateUser);
    this.router.delete(`${this.path}/user/:id`, userController.deleteUser);
  }
}

export default AuthRoute;
