import create from 'zustand';
import { combine } from 'zustand/middleware';
import { UserInterface } from 'interfaces';

export const useUserStore = create(
  combine(
    {
      user: undefined as UserInterface | undefined,
    },
    (set) => ({
      setUser: (payload: UserInterface | undefined) => set((state) => ({ ...state, user: payload })),
    }),
  ),
);
