import React from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { useUserStore } from '@src/storage/useUserStore';
import { FolderInterface, SetInterface } from '@src/interfaces';
import { ActionList } from '@src/ui/ActionList';
import { authApi, folderApi, setApi } from '@src/apis';

type StateType = { userSets: SetInterface[]; userFolders: FolderInterface[] };

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { signAccess } = useUserStore();
  const [shownFolder, setShownFolder] = React.useState(false);
  const toggleShownFolder = () => setShownFolder(!shownFolder);

  const user = useQuery('user', () => authApi.me(signAccess)); // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userSets = useQuery('userSets', () => setApi.getByUser(user.data!.id), { enabled: !!user.data }); // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userFolders = useQuery('userFolders', () => folderApi.getByUser(user.data!.id), { enabled: !!user.data });
  const set = useQuery('sets', () => setApi.get(user.data?.id), { enabled: !!user.data || user.isFetched });
  const folder = useQuery('folders', () => folderApi.get(user.data?.id), { enabled: !!user.data || user.isFetched });

  const [state, setState] = React.useState<StateType>({ userSets: [], userFolders: [] });
  React.useEffect(() => {
    if (userSets.data) setState((prev) => ({ ...prev, userSets: userSets.data }));
    if (userFolders.data) setState((prev) => ({ ...prev, userFolders: userFolders.data }));
  }, [userSets.data, userFolders.data]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <ActionList
        header={{ title: 'Folders' }}
        data={state.userFolders}
        keyExtractor={(item) => item.id}
        renderItem={(item, index) => (
          <ActionList.Link href={`sets?folder=${item.id}`} isFirst={index === 0}>
            {item.name}
          </ActionList.Link>
        )}
      />
    </div>
  );
};

export default Dashboard;
