import { create } from 'zustand';
import { combine, persist, createJSONStorage } from 'zustand/middleware';

import * as Types from '@src/types';

interface InitialState {
  sets: Types.SetModel[];
  folders: Types.FolderModel[];
  user: Types.UserModel | undefined;
}

const initialState: InitialState = {
  sets: [],
  folders: [],
  user: undefined,
};

const useLocalStore = create(
  persist(
    combine(initialState, (set) => ({
      setValues: (payload: Partial<InitialState> | ((prevState: InitialState) => InitialState)) =>
        set((state) => (typeof payload === 'function' ? payload(state) : { ...state, ...payload })),

      destroy: () => set(() => initialState),
    })),
    { name: 'mwb:useLocalStore', storage: createJSONStorage(() => localStorage) },
  ),
);

export default useLocalStore;
