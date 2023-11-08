import http from '@src/lib/http';
import { FolderInterface, FolderInterfaceDraft } from '@src/interfaces';
import consts from '@src/lib/consts';
import { setApi, authApi } from '@src/apis';

export const folderApi = {
  async get(excludeUserId?: string): Promise<FolderInterface[]> {
    if (consts.isBackendLess) {
      await Promise.resolve();
      const folders = JSON.parse(localStorage[`${consts.storageKey}_folders`] || '[]');
      return Array.isArray(folders) ? folders : [];
    } else {
      const response = await http.get(`/folders${excludeUserId ? `?excludeUserId=${excludeUserId}` : ''}`);
      return response.data;
    }
  },

  async getById(payload: string): Promise<FolderInterface | null> {
    if (consts.isBackendLess) {
      await Promise.resolve();
      const sets = await setApi.get();
      const folders = await folderApi.get();
      const folderById = folders.find((item) => item.id === payload) || null;
      if (folderById) folderById.sets = sets.filter((item) => (folderById.sets as unknown as string[]).includes(item.id));
      return folderById;
    } else {
      const response = await http.get(`/folder/${payload}`);
      return response.data;
    }
  },

  async getByUser(id: string): Promise<FolderInterface[]> {
    if (consts.isBackendLess) {
      await Promise.resolve();
      const folders = await folderApi.get();
      const foldersByUser = folders.filter((item) => item.user.id === id);
      return foldersByUser;
    } else {
      const response = await http.get(`/folder/byuser/${id}`);
      return response.data;
    }
  },

  async save(data: FolderInterfaceDraft): Promise<string> {
    if (consts.isBackendLess) {
      const folders = await folderApi.get();
      const user = await authApi.me();
      const nextFolders = folders.filter((item) => item.id !== data.id);
      const currFolder = data.id ? folders.find((item) => item.id === data.id) : undefined;
      const saveFolder = {
        ...currFolder,
        ...data,
        id: currFolder?.id || crypto.randomUUID(),
        sets: currFolder?.sets || [],
        user: user,
        createdAt: currFolder?.id ? currFolder.createdAt : new Date().toISOString(),
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
      const folders = await folderApi.get();
      const nextFolders = folders.filter((item) => item.id !== id);
      localStorage.setItem(`${consts.storageKey}_folders`, JSON.stringify(nextFolders));
    } else await http.delete(`/folder/${id}`);
  },
};
