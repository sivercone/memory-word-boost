import { create } from 'zustand';
import { combine } from 'zustand/middleware';

import * as Types from '@src/types';

interface InitialState {
  studySetDraft: Types.SetForm;
}

const initialState: InitialState = {
  studySetDraft: { id: '', name: '', description: '', folderId: 'sets', cards: [] },
};

const useRuntimeStore = create(
  combine(initialState, (set) => ({
    setValues: (payload: Partial<InitialState> | ((prevStage: InitialState) => InitialState)): void =>
      set((state) => (typeof payload === 'function' ? payload(state) : { ...state, ...payload })),

    destroy: (keys?: (keyof InitialState)[]) =>
      set((state) => {
        if (!keys) return initialState;
        const partialReset = keys.reduce((acc, key) => {
          acc[key] = initialState[key];
          return acc;
        }, {} as Partial<InitialState>);
        return { ...state, ...partialReset };
      }),
  })),
);

export default useRuntimeStore;
