import { Router } from 'express';
import { authController } from '@/controllers/authController';
import { isAuth } from '@/middlewares/isAuth';
import { userController } from '@/controllers/userController';
import { Routes } from '@/interfaces';

class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, authController.logIn);
    this.router.get(`${this.path}/me`, isAuth, authController.me);
    this.router.get(`${this.path}/logout`, isAuth, authController.logOut);
    this.router.get(`${this.path}/user/:id`, userController.getUserById);
    this.router.put(`${this.path}/user/update`, isAuth, userController.updateUser);
    this.router.delete(`${this.path}/user/:id`, isAuth, userController.deleteUser);
  }
}

export default AuthRoute;
