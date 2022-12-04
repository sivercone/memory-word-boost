import create from 'zustand';
import { combine } from 'zustand/middleware';
import { FolderInterface, SetInterface } from 'interfaces';
import { localMemory } from 'lib/browserMemory';

const sets = localMemory.get('mwb_sets');
const folders = localMemory.get('mwb_folders');

export const useLocalStore = create(
  combine(
    {
      localSets: (sets as SetInterface[]) || [],
      localFolders: (folders as FolderInterface[]) || [],
    },
    (set) => ({
      setLocalSets: (payload: SetInterface[]) =>
        set((state) => {
          localMemory.set('mwb_sets', payload);
          return { ...state, localSets: payload };
        }),
      setLocalFolders: (payload: FolderInterface[]) =>
        set((state) => {
          localMemory.set('mwb_folders', payload);
          return { ...state, localFolders: payload };
        }),
    }),
  ),
);
