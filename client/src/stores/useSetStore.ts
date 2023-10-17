import create from 'zustand';
import { combine } from 'zustand/middleware';
import { SetInterface } from '@src/interfaces';

const initialState = {
  currStudySet: {
    id: '',
    title: '',
    description: '',
    tags: [],
    folders: [],
  } as Partial<SetInterface>,
};
export const useSetStore = create(
  combine(initialState, (set) => ({
    setCurrStudySet: (payload: Partial<SetInterface>) =>
      set((state) => ({ ...state, currStudySet: { ...state.currStudySet, ...payload } })),
    resetCurrStudySet: () => set((state) => ({ ...state, currStudySet: initialState.currStudySet })),
  })),
);

export default useSetStore;
