import http from '@src/lib/http';
import { FolderInterface, FolderInterfaceDraft } from '@src/interfaces';

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

  async save(data: FolderInterfaceDraft): Promise<string> {
    try {
      const response = await http({ url: '/folder', method: data.id ? 'PUT' : 'POST', data: data });
      return response.data;
    } catch (error) {
      throw error.response?.data;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await http.delete(`/folder/${id}`);
    } catch (error) {
      throw error.response?.data;
    }
  },
};
