import { FolderInterface, SetInterface, SetInterfaceDraft, UserInterface } from 'interfaces';

const path = 'http://localhost:7001/set';

export const setApi = {
  async get(excludeUserId: string | undefined): Promise<SetInterface[]> {
    const response = await fetch(`${path}s?excludeUserId=${excludeUserId}`);
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  },

  async getById(payload: string): Promise<SetInterface> {
    const response = await fetch(`${path}/${payload}`);
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  },

  async getByUser(payload: UserInterface): Promise<SetInterface[]> {
    const response = await fetch(`${path}/byuser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  },

  async save(payload: { data: SetInterfaceDraft & { folders?: FolderInterface[] }; token: string | undefined }): Promise<string> {
    const response = await fetch(path, {
      method: payload.data.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${payload.token}` },
      credentials: 'include',
      body: JSON.stringify(payload.data),
    });
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  },

  async delete(payload: { id: string; token: string | undefined }): Promise<void> {
    const response = await fetch(`${path}/${payload.id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { Authorization: `Bearer ${payload.token}` },
    });
    if (!response.ok) throw new Error(response.statusText);
  },
};
