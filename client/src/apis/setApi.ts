import http from 'lib/http';
import { FolderInterface, SetInterface, SetInterfaceDraft } from 'interfaces';

export const setApi = {
  async get(excludeUserId: string | undefined): Promise<SetInterface[]> {
    try {
      const response = await http.get(`/sets${excludeUserId ? `?excludeUserId=${excludeUserId}` : ''}`);
      return response.data;
    } catch (error) {
      throw error.response?.data;
    }
  },

  async getById(payload: string): Promise<SetInterface> {
    try {
      const response = await http.get(`/set/${payload}`);
      return response.data;
    } catch (error) {
      throw error.response?.data;
    }
  },

  async getByUser(id: string): Promise<SetInterface[]> {
    try {
      const response = await http.get(`/set/byuser/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data;
    }
  },

  async save(data: SetInterfaceDraft): Promise<string> {
    try {
      const response = await http({ url: '/set', method: data.id ? 'PUT' : 'POST', data: data });
      return response.data;
    } catch (error) {
      throw error.response?.data;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await http.delete(`/set/${id}`);
    } catch (error) {
      throw error.response?.data;
    }
  },
};
