import { SetInterface } from 'interfaces';

const path = 'http://localhost:7001/set';

export const setApi = {
   async getSets(): Promise<SetInterface[]> {
      const response = await fetch(path);
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
   },

   async getSetById(payload: string): Promise<SetInterface> {
      const response = await fetch(`${path}/${payload}`);
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
   },

   async createSet(payload: SetInterface): Promise<void> {
      const response = await fetch(path, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(response.statusText);
   },

   async deleteSet(payload: string): Promise<void> {
      const response = await fetch(`${path}/${payload}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(response.statusText);
   },
};
