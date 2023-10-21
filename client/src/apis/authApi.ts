import http from '@src/lib/http';
import { UserInterface } from '@src/interfaces';

export const authApi = {
  async login(body: { email: string; password: string }): Promise<void> {
    try {
      const response = await http.post(`auth/login`, body);
      return response.data;
    } catch (error) {
      throw error.response?.data;
    }
  },

  async me(): Promise<UserInterface> {
    try {
      const response = await http.get(`auth/me`);
      return response.data;
    } catch (error) {
      throw error.response?.data;
    }
  },

  async logout(): Promise<void> {
    try {
      await http.post(`auth/logout`);
    } catch (error) {
      throw error.response?.data;
    }
  },

  async getById(payload: string): Promise<UserInterface> {
    try {
      const response = await http.get(`auth/user/${payload}`);
      return response.data;
    } catch (error) {
      throw error.response?.data;
    }
  },

  async update(payload: UserInterface): Promise<void> {
    try {
      await http.put(`auth/user/update`, payload);
    } catch (error) {
      throw error.response?.data;
    }
  },
};
