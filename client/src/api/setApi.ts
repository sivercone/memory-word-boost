import { FolderInterface, SetInterface, SetInterfaceDraft, UserInterface } from 'interfaces';

const path = 'http://localhost:7001/set';

export const setApi = {
  async get(): Promise<SetInterface[]> {
    const response = await fetch(`${path}s`);
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

  async save(payload: SetInterfaceDraft & { folders?: FolderInterface[] }): Promise<string> {
    const response = await fetch(path, {
      method: payload.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  },

  async delete(payload: string): Promise<void> {
    const response = await fetch(`${path}/${payload}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(response.statusText);
  },
};
