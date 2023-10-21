import create from 'zustand';
import { combine } from 'zustand/middleware';
import { SetInterfaceDraft } from '@src/interfaces';

const initialState = {
  currStudySet: {
    id: '',
    title: '',
    description: '',
    folderId: 'sets',
  } as SetInterfaceDraft,
};
export const useSetStore = create(
  combine(initialState, (set) => ({
    setCurrStudySet: (payload: SetInterfaceDraft) =>
      set((state) => ({ ...state, currStudySet: { ...state.currStudySet, ...payload } })),
    resetCurrStudySet: () => set((state) => ({ ...state, currStudySet: initialState.currStudySet })),
  })),
);

export default useSetStore;
