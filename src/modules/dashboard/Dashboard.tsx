import type { NextPage } from 'next';

import { composeSortedFolders } from '@src/lib/utils/array';
import { useLocalStore } from '@src/stores';
import { ActionList, Icons } from '@src/ui';

import Banner from './Banner';

const Dashboard: NextPage = () => {
  const { userId, folders } = useLocalStore();
  const sortedFolders = composeSortedFolders(folders.filter((item) => item.userId === userId));

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4">
      <Banner />
      <ActionList
        header={{ title: 'Folders' }}
        data={sortedFolders}
        keyExtractor={(item) => item.id}
        renderItem={(item, index) => (
          <ActionList.Link href={`/sets?${item.id === 'sets' ? `user=${userId}` : `folder=${item.id}`}`} isFirst={index === 0}>
            <Icons.Folder className="flex-shrink-0" />
            <span>{item.name}</span>
          </ActionList.Link>
        )}
      />
    </div>
  );
};

export default Dashboard;
