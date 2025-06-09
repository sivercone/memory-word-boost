import clsx from 'clsx';
import { useRouter } from 'next/router';

import { utils } from '@src/lib';
import { useLocalStore, useRuntimeStore } from '@src/stores';
import { ActionList, ButtonLink, Icons } from '@src/ui';

const Folders: React.FC = () => {
  const router = useRouter();
  const { user, folders } = useLocalStore();
  const { studySetDraft, ...rtStore } = useRuntimeStore();

  const sortedFolders = utils.array.composeSortedFolders(folders.filter((item) => item.userId === user?.id));

  const onSelect = (folderId: string) => {
    rtStore.setValues({ studySetDraft: { ...studySetDraft, folderId } });
    router.push({ pathname: router.pathname, query: studySetDraft.id && { id: router.query.id } });
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-4">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-medium text-onSurface">Folders</h1>
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
            <Icons.Check className={clsx('flex-shrink-0', studySetDraft.folderId === item.id ? 'visible' : 'invisible')} />
            <span>{item.name}</span>
          </ActionList.Button>
        )}
      />
    </div>
  );
};

export default Folders;
