import { useRouter } from 'next/router';
import React from 'react';

import { useLocalStore, useRuntimeStore } from '@src/stores';
import { ActionList, ButtonLink, Icons } from '@src/ui';

const Folders: React.FC = () => {
  const router = useRouter();
  const { user, folders } = useLocalStore();
  const { studySetDraft, ...rtStore } = useRuntimeStore();

  const userFolders = folders.filter((item) => item.userId === user?.id);
  const sortedFolders = [...userFolders, { id: 'sets', name: 'Sets' }].sort((a, b) =>
    a.id === 'sets' ? -1 : b.id === 'sets' ? 1 : a.name.localeCompare(b.name),
  );

  const onSelect = (id: string) => {
    rtStore.setValues({ studySetDraft: { ...studySetDraft, folderId: id } });

    router.push({ pathname: router.pathname, query: studySetDraft.id && { id: router.query.id } });
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4 py-4 px-4">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-medium">Folders</h1>
        <div className="ml-auto flex items-center gap-4">
          <ButtonLink href={{ pathname: router.pathname, query: studySetDraft.id && { id: router.query.id } }} title="Back">
            <Icons.ArrowLeft />
          </ButtonLink>
        </div>
      </div>

      <ActionList
        data={sortedFolders}
        keyExtractor={(item) => item.id}
        renderItem={(item, index) => (
          <ActionList.Button onClick={() => onSelect(item.id)} isFirst={index === 0} className="flex items-center">
            <Icons.Check className={studySetDraft.folderId === item.id ? 'visible' : 'invisible'} />
            <span>{item.name}</span>
          </ActionList.Button>
        )}
      />
    </div>
  );
};

export default Folders;
