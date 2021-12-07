import create from 'zustand';
import { combine } from 'zustand/middleware';
import { SetInterface } from 'interfaces';

export const useSetStore = create(
   combine(
      {
         setFigure: undefined as SetInterface | undefined,
      },
      (set) => ({
         setSetFigure: (payload: SetInterface | undefined) => set((state) => ({ ...state, status: payload })),
      }),
   ),
);
