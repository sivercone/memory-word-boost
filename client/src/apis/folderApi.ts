import { FolderInterface, FolderInterfaceDraft, SetInterface } from 'interfaces';

const path = 'http://localhost:7001/folder';

export const folderApi = {
  async get(excludeUserId: string | undefined): Promise<FolderInterface[]> {
    const response = await fetch(`${path}s${excludeUserId ? `?excludeUserId=${excludeUserId}` : ''}`);
    if (!response.ok) throw await response.json();
    return response.json();
  },

  async getById(payload: string): Promise<FolderInterface> {
    const response = await fetch(`${path}/${payload}`);
    if (!response.ok) throw await response.json();
    return response.json();
  },

  async getByUser(id: string): Promise<FolderInterface[]> {
    const response = await fetch(`${path}/byuser/${id}`);
    if (!response.ok) throw await response.json();
    return response.json();
  },

  async save(payload: { data: FolderInterfaceDraft & { sets?: SetInterface[] }; token: string | undefined }): Promise<string> {
    const response = await fetch(path, {
      method: payload.data.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${payload.token}` },
      credentials: 'include',
      body: JSON.stringify(payload.data),
    });
    if (!response.ok) throw await response.json();
    return response.json();
  },

  async delete(payload: { id: string; token: string | undefined }): Promise<void> {
    const response = await fetch(`${path}/${payload.id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { Authorization: `Bearer ${payload.token}` },
    });
    if (!response.ok) throw await response.json();
  },
};
