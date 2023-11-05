import http from '@src/lib/http';
import { SetInterface, SetInterfaceDraft } from '@src/interfaces';
import consts from '@src/lib/consts';

export const setApi = {
  async get(excludeUserId: string | undefined): Promise<SetInterface[]> {
    if (consts.isBackendLess) {
      await Promise.resolve();
      return JSON.parse(localStorage[`${consts.storageKey}_sets`]);
    } else {
      const response = await http.get(`/sets${excludeUserId ? `?excludeUserId=${excludeUserId}` : ''}`);
      return response.data;
    }
  },

  async getById(payload: string): Promise<SetInterface> {
    if (consts.isBackendLess) {
      await Promise.resolve();
      const sets = JSON.parse(localStorage[`${consts.storageKey}_sets`] || '[]');
      const setById = Array.isArray(sets) ? sets.find((item) => item.id === payload) : null;
      return setById;
    } else {
      const response = await http.get(`/set/${payload}`);
      return response.data;
    }
  },

  async getByUser(id: string): Promise<SetInterface[]> {
    if (consts.isBackendLess) {
      await Promise.resolve();
      const sets = JSON.parse(localStorage[`${consts.storageKey}_sets`] || '[]');
      const setsByUser = Array.isArray(sets) ? sets.filter((item) => item.user.id === id) : [];
      return setsByUser;
    } else {
      const response = await http.get(`/set/byuser/${id}`);
      return response.data;
    }
  },

  async save(data: SetInterfaceDraft): Promise<string> {
    if (consts.isBackendLess) {
      await Promise.resolve();
      const folders = JSON.parse(localStorage[`${consts.storageKey}_folders`] || '[]');
      const sets = JSON.parse(localStorage[`${consts.storageKey}_sets`] || '[]');
      const nextSets = Array.isArray(sets) ? (data.id ? sets.filter((item) => item.id !== data.id) : sets) : [];
      const currSet = Array.isArray(sets) && data.id ? sets.find((item) => item.id === data.id) : {};
      const saveSet = {
        ...currSet,
        ...data,
        id: currSet.id || crypto.randomUUID(),
        cards: data.cards || [],
        folder: (Array.isArray(folders) ? folders.find((item) => item.id === data.folderId) : currSet.folder) || null,
        user: JSON.parse(localStorage[`${consts.storageKey}_user`]),
        createdAt: currSet.id ? currSet.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as SetInterface & SetInterfaceDraft;
      delete saveSet.folderId;
      const updatedFolders = Array.isArray(folders)
        ? folders.map((item) =>
            item.id === saveSet.folder.id ? { ...item, sets: Array.from(new Set([...item.sets, saveSet.id])) } : item,
          )
        : [];
      localStorage.setItem(`${consts.storageKey}_folders`, JSON.stringify(updatedFolders));
      localStorage.setItem(`${consts.storageKey}_sets`, JSON.stringify([...nextSets, saveSet]));
      return saveSet.id;
    } else {
      const response = await http({ url: '/set', method: data.id ? 'PUT' : 'POST', data: data });
      return response.data;
    }
  },

  async delete(id: string): Promise<void> {
    if (consts.isBackendLess) {
      await Promise.resolve();
      const sets = JSON.parse(localStorage[`${consts.storageKey}_sets`]);
      const nextSets = Array.isArray(sets) ? sets.filter((item) => item.id !== id) : [];
      localStorage.setItem(`${consts.storageKey}_sets`, JSON.stringify(nextSets));
    } else await http.delete(`/set/${id}`);
  },
};
