import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import FolderForm from '../folder-form';
import { useLocalStore } from '@src/stores';
import { ActionList, Button, DropdownMenu, Icons } from '@src/ui';

import DeleteDialog from './FolderDelete';

const FolderDetails = () => {
  const router = useRouter();
  const { sets, folders } = useLocalStore();
  const folderQuery = router.query.folder;
  const userQuery = router.query.user;

  const [shownModal, setShownModal] = useState<'edit' | 'del' | null>(null);
  const folder = folderQuery ? folders.find((item) => item.id === folderQuery) : null;

  const menuOptions = useMemo(() => {
    if (!folder) return [];
    return [
      { title: 'Author', action: () => router.push(`/user/${folder.userId}`), icon: <Icons.Person /> },
      { title: 'Edit', action: () => setShownModal('edit'), icon: <Icons.Edit /> },
      { title: 'Delete', action: () => setShownModal('del'), icon: <Icons.Delete /> },
    ];
  }, [folder]);

  const studySets = useMemo(() => {
    if (folderQuery === 'new') return [];
    if (folderQuery) return sets.filter((item) => item.folderId === folderQuery);
    if (userQuery) return sets.filter((item) => item.userId === userQuery);
    return [];
  }, [folderQuery, userQuery, sets]);

  useEffect(() => {
    if (folderQuery === 'new') setShownModal('edit');
  }, [folderQuery]);

  return (
    <>
      {(folderQuery === 'new' || folder) && (
        <div className="bg-white py-8 border-b border-b-gray-200">
          <div className="max-w-3xl mx-auto flex flex-col gap-4 px-4">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-md bg-white border border-solid border-gray-200" />
              <div>
                <h1 className="text-2xl font-medium">{folder?.name || 'New Folder'}</h1>
                {folder?.description && <p className="leading-relaxed text-gray-600">{folder.description}</p>}
              </div>
            </div>
            <DropdownMenu
              options={menuOptions}
              trigger={
                <Button title="Actions">
                  <Icons.More />
                </Button>
              }
              keyExtractor={(item) => item.title}
              renderItem={(item) => (
                <DropdownMenu.Item onClick={item.action} className="justify-between">
                  <span>{item.title}</span>
                  {item.icon}
                </DropdownMenu.Item>
              )}
            />
          </div>
        </div>
      )}

      {folder && <DeleteDialog data={folder} open={shownModal === 'del'} close={() => setShownModal(null)} />}

      <div className="p-4 max-w-3xl mx-auto">
        <ActionList
          header={{ title: 'Sets' }}
          placeholder="Nothing yet"
          data={studySets}
          keyExtractor={(item) => item.id}
          renderItem={(item, index) => (
            <ActionList.Link href={`/sets/${item.id}`} isFirst={index === 0}>
              <Icons.Set />
              <span>{item.name}</span>
            </ActionList.Link>
          )}
        />
      </div>

      <FolderForm
        data={folder && folderQuery !== 'new' ? folder : undefined}
        open={shownModal === 'edit'}
        close={() => setShownModal(null)}
      />
    </>
  );
};

export default FolderDetails;
