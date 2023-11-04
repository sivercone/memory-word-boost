import http from '@src/lib/http';
import { FolderInterface, FolderInterfaceDraft } from '@src/interfaces';
import consts from '@src/lib/consts';

export const folderApi = {
  async get(excludeUserId: string | undefined): Promise<FolderInterface[]> {
    if (consts.isBackendLess) {
      await Promise.resolve();
      return JSON.parse(localStorage[`${consts.storageKey}_folders`]);
    } else {
      const response = await http.get(`/folders${excludeUserId ? `?excludeUserId=${excludeUserId}` : ''}`);
      return response.data;
    }
  },

  async getById(payload: string): Promise<FolderInterface> {
    if (consts.isBackendLess) {
      await Promise.resolve();
      const folders = JSON.parse(localStorage[`${consts.storageKey}_folders`] || '[]');
      const folderById = Array.isArray(folders) ? folders.find((item) => item.id === payload) : null;
      return folderById;
    } else {
      const response = await http.get(`/folder/${payload}`);
      return response.data;
    }
  },

  async getByUser(id: string): Promise<FolderInterface[]> {
    if (consts.isBackendLess) {
      await Promise.resolve();
      const folders = JSON.parse(localStorage[`${consts.storageKey}_folders`] || '[]');
      const foldersByUser = Array.isArray(folders) ? folders.filter((item) => item.user.id === id) : [];
      return foldersByUser;
    } else {
      const response = await http.get(`/folder/byuser/${id}`);
      return response.data;
    }
  },

  async save(data: FolderInterfaceDraft): Promise<string> {
    if (consts.isBackendLess) {
      const folders = JSON.parse(localStorage[`${consts.storageKey}_folders`] || '[]');
      const nextFolders = Array.isArray(folders) ? (data.id ? folders.filter((item) => item.id !== data.id) : folders) : [];
      const currFolder = Array.isArray(folders) && data.id ? folders.find((item) => item.id === data.id) : {};
      const saveFolder = {
        ...currFolder,
        ...data,
        id: currFolder.id || crypto.randomUUID(),
        sets: currFolder.sets || [],
        user: JSON.parse(localStorage[`${consts.storageKey}_user`]),
        createdAt: currFolder.id ? currFolder.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as FolderInterface;
      localStorage.setItem(`${consts.storageKey}_folders`, JSON.stringify([...nextFolders, saveFolder]));
      return saveFolder.id;
    } else {
      const response = await http({ url: '/folder', method: data.id ? 'PUT' : 'POST', data: data });
      return response.data;
    }
  },

  async delete(id: string): Promise<void> {
    if (consts.isBackendLess) {
      await Promise.resolve();
      const folders = JSON.parse(localStorage[`${consts.storageKey}_folders`]);
      const nextFolders = Array.isArray(folders) ? folders.filter((item) => item.id !== id) : [];
      localStorage.setItem(`${consts.storageKey}_folders`, JSON.stringify(nextFolders));
    } else await http.delete(`/folder/${id}`);
  },
};
