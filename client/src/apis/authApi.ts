import http from '@src/lib/http';
import consts from '@src/lib/consts';
import { UserInterface } from '@src/interfaces';

export const authApi = {
  async login(body: { email: string; password: string }): Promise<void> {
    if (consts.isBackendLess) {
      await Promise.resolve();
      localStorage.setItem(
        `${consts.storageKey}_user`,
        JSON.stringify({
          id: crypto.randomUUID(),
          email: body.email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      );
    } else await http.post(`auth/login`, body);
  },

  async me(): Promise<UserInterface> {
    if (consts.isBackendLess) {
      await Promise.resolve();
      return JSON.parse(localStorage[`${consts.storageKey}_user`]);
    } else {
      const response = await http.get(`auth/me`);
      return response.data;
    }
  },

  async logout(): Promise<void> {
    if (consts.isBackendLess) await Promise.resolve();
    else await http.post(`auth/logout`);
  },

  async getById(payload: string): Promise<UserInterface> {
    if (consts.isBackendLess) {
      await Promise.resolve();
      return JSON.parse(localStorage[`${consts.storageKey}_user`]);
    } else {
      const response = await http.get(`auth/user/${payload}`);
      return response.data;
    }
  },

  async update(payload: UserInterface): Promise<void> {
    if (consts.isBackendLess) {
      await Promise.resolve();
      const userObject = JSON.parse(localStorage[`${consts.storageKey}_user`]);
      localStorage.setItem(
        `${consts.storageKey}_user`,
        JSON.stringify({ ...userObject, ...payload, updatedAt: new Date().toISOString() }),
      );
    } else await http.put(`auth/user/update`, payload);
  },
};
