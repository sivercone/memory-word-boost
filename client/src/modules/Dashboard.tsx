import type { NextPage } from 'next';
import { useQuery } from 'react-query';
import { useUserStore } from '@src/storage/useUserStore';
import { ActionList } from '@src/ui';
import { authApi, folderApi } from '@src/apis';

const Dashboard: NextPage = () => {
  const { signAccess } = useUserStore();

  const user = useQuery('user', () => authApi.me(signAccess)); // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userFolders = useQuery('userFolders', () => folderApi.getByUser(user.data!.id), { enabled: !!user.data });
  const folders = [...(userFolders.data || []), { id: 'sets', name: 'Sets' }].sort((a, b) =>
    a.id === 'sets' ? -1 : b.id === 'sets' ? 1 : a.name.localeCompare(b.name),
  );

  return (
    <div className="max-w-3xl mx-auto p-4">
      <ActionList
        header={{ title: 'Folders' }}
        data={folders}
        keyExtractor={(item) => item.id}
        renderItem={(item, index) => (
          <ActionList.Link href={`/sets?${item.id === 'sets' ? `user=${user.data?.id}` : `folder=${item.id}`}`} isFirst={index === 0}>
            {item.name}
          </ActionList.Link>
        )}
      />
    </div>
  );
};

export default Dashboard;
