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

  async save(payload: { data: SetInterfaceDraft & { folders?: FolderInterface[] }; token: string | undefined }): Promise<string> {
    try {
      const method = payload.data.id ? 'PUT' : 'POST';
      const response = await http({
        url: '/set',
        method,
        headers: { Authorization: `Bearer ${payload.token}` },
        data: payload.data,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data;
    }
  },

  async delete(payload: { id: string; token: string | undefined }): Promise<void> {
    try {
      await http.delete(`/set/${payload.id}`, { headers: { Authorization: `Bearer ${payload.token}` } });
    } catch (error) {
      throw error.response?.data;
    }
  },
};
