import create from 'zustand';
import { combine } from 'zustand/middleware';
import { SetInterface } from 'interfaces';

export const useSetStore = create(
  combine(
    {
      setFigure: undefined as SetInterface | undefined,
      currStudySet: {} as Partial<SetInterface>,
    },
    (set) => ({
      setSetFigure: (payload: SetInterface | undefined) => set((state) => ({ ...state, setFigure: payload })),
      setCurrStudySet: (payload: Partial<SetInterface>) =>
        set((state) => ({ ...state, currStudySet: { ...state.currStudySet, ...payload } })),
    }),
  ),
);
