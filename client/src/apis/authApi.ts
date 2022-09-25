import { UserInterface } from 'interfaces';

const path = 'http://localhost:7001/auth';

export const authApi = {
  async me(token?: string): Promise<UserInterface> {
    const response = await fetch(`${path}/me`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    });
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  },

  async getById(payload: string): Promise<UserInterface> {
    const response = await fetch(`${path}/user/${payload}`);
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  },

  async update(payload: UserInterface): Promise<void> {
    const response = await fetch(`${path}/user/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(response.statusText);
  },
};
