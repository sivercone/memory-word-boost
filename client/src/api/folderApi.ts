import { FolderInterface, SetInterface, UserInterface } from 'interfaces';

const path = 'http://localhost:7001/folder';

export const folderApi = {
  async get(): Promise<FolderInterface[]> {
    const response = await fetch(`${path}s`);
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  },

  async getById(payload: string): Promise<FolderInterface> {
    const response = await fetch(`${path}/${payload}`);
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  },

  async getByUser(payload: UserInterface): Promise<FolderInterface[]> {
    const response = await fetch(`${path}/byuser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  },

  async create(payload: FolderInterface): Promise<string> {
    const response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  },

  async update(payload: FolderInterface): Promise<void> {
    const response = await fetch(path, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(response.statusText);
  },

  async delete(payload: string): Promise<void> {
    const response = await fetch(`${path}/${payload}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(response.statusText);
  },
};
