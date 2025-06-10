import { create } from 'zustand';
import { combine, persist, createJSONStorage } from 'zustand/middleware';

import * as Types from '@src/types';

interface InitialState {
  sets: Types.SetModel[];
  folders: Types.FolderModel[];
  userId: Types.UserModel['id'] | undefined;
  users: Types.UserModel[];
}

const initialState: InitialState = {
  sets: [],
  folders: [],
  userId: undefined,
  users: [],
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
