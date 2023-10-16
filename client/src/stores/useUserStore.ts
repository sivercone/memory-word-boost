import create from 'zustand';
import { combine } from 'zustand/middleware';
import { UserInterface } from 'interfaces';

const useUserStore = create(
  combine(
    {
      user: undefined as UserInterface | undefined,
      signAccess: undefined as string | undefined,
    },
    (set) => ({
      setUser: (payload: UserInterface | undefined) => set((state) => ({ ...state, user: payload })),
      setSignAccess: (payload: string | undefined) => set((state) => ({ ...state, signAccess: payload })),
    }),
  ),
);

export default useUserStore;
