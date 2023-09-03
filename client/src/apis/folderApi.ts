import http from 'lib/http';
import { FolderInterface, FolderInterfaceDraft, SetInterface } from 'interfaces';

export const folderApi = {
  async get(excludeUserId: string | undefined): Promise<FolderInterface[]> {
    try {
      const response = await http.get(`/folders${excludeUserId ? `?excludeUserId=${excludeUserId}` : ''}`);
      return response.data;
    } catch (error) {
      throw error.response?.data;
    }
  },

  async getById(payload: string): Promise<FolderInterface> {
    try {
      const response = await http.get(`/folder/${payload}`);
      return response.data;
    } catch (error) {
      throw error.response?.data;
    }
  },

  async getByUser(id: string): Promise<FolderInterface[]> {
    try {
      const response = await http.get(`/folder/byuser/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data;
    }
  },

  async save(payload: { data: FolderInterfaceDraft & { sets?: SetInterface[] }; token: string | undefined }): Promise<string> {
    try {
      const method = payload.data.id ? 'PUT' : 'POST';
      const response = await http({
        url: '/folder',
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
      await http.delete(`/folder/${payload.id}`, { headers: { Authorization: `Bearer ${payload.token}` } });
    } catch (error) {
      throw error.response?.data;
    }
  },
};
