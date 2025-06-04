import type { NextPage } from 'next';

import { useLocalStore } from '@src/stores';
import { ActionList, Icons } from '@src/ui';

import Banner from './Banner';

const Dashboard: NextPage = () => {
  const { user, folders } = useLocalStore();
  const userFolders = folders.filter((item) => item.userId === user?.id);
  const sortedFolders = [...(userFolders || []), { id: 'sets', name: 'Sets' }].sort((a, b) =>
    a.id === 'sets' ? -1 : b.id === 'sets' ? 1 : a.name.localeCompare(b.name),
  );

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <Banner />
      <ActionList
        header={{ title: 'Folders' }}
        data={sortedFolders}
        keyExtractor={(item) => item.id}
        renderItem={(item, index) => (
          <ActionList.Link href={`/sets?${item.id === 'sets' ? `user=${user?.id}` : `folder=${item.id}`}`} isFirst={index === 0}>
            <Icons.Folder />
            <span>{item.name}</span>
          </ActionList.Link>
        )}
      />
    </div>
  );
};

export default Dashboard;
