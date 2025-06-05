import * as Types from '@src/types';

export function composeSortedFolders(folders: Types.FolderModel[]): Pick<Types.FolderModel, 'id' | 'name'>[] {
  const defaultFolder = { id: 'sets', name: 'Sets' };
  const sortedFolders = [...(folders || []), defaultFolder].sort((a, b) =>
    a.id === 'sets' ? -1 : b.id === 'sets' ? 1 : a.name.localeCompare(b.name),
  );

  return sortedFolders;
}
