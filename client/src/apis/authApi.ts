import { UserInterface } from 'interfaces';

const path = 'http://localhost:7001/auth';

export const authApi = {
  async me(token: string | undefined): Promise<UserInterface & { signAccess: string | undefined }> {
    const response = await fetch(`${path}/me`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    });
    if (!response.ok) throw await response.json();
    return response.json();
  },

  async getById(payload: string): Promise<UserInterface> {
    const response = await fetch(`${path}/user/${payload}`);
    if (!response.ok) throw await response.json();
    return response.json();
  },

  async update(payload: { data: UserInterface; token: string | undefined }): Promise<void> {
    const response = await fetch(`${path}/user/update`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${payload.token}` },
      body: JSON.stringify(payload.data),
    });
    if (!response.ok) throw await response.json();
  },

  async logout(token: string | undefined): Promise<void> {
    const response = await fetch(`${path}/logout`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    });
    if (!response.ok) throw await response.json();
    return response.json();
  },
};
