import http from 'lib/http';
import { UserInterface } from 'interfaces';

export const authApi = {
  async me(token: string | undefined): Promise<UserInterface & { signAccess: string | undefined }> {
    try {
      const response = await http.get(`auth/me`, { headers: { Authorization: `Bearer ${token}` } });
      return response.data;
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

  async update(payload: { data: UserInterface; token: string | undefined }): Promise<void> {
    try {
      await http.put(`auth/user/update`, payload.data, { headers: { Authorization: `Bearer ${payload.token}` } });
    } catch (error) {
      throw error.response?.data;
    }
  },

  async logout(token: string | undefined): Promise<void> {
    try {
      await http.post(`auth/logout`, {}, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
      throw error.response?.data;
    }
  },
};
