import React from 'react';
import type { NextPage } from 'next';
import { useQuery } from 'react-query';
import { setApi } from 'apis/setApi';
import { folderApi } from 'apis/folderApi';
import { useUserStore } from 'storage/useUserStore';
import { CardBox } from 'ui/CardBox';
import { Button } from 'ui/Button';
import { useRouter } from 'next/router';
import { FolderForm } from 'modules/FolderForm';
import { authApi } from 'apis/authApi';
import { isBackendLess } from 'lib/staticData';
import { useLocalStore } from 'storage/useLocalStore';
import { FolderInterface, SetInterface } from 'interfaces';
import style from 'styles/pages/home.module.scss';

type StateType = { userSets: SetInterface[]; userFolders: FolderInterface[] };

const Home: NextPage = () => {
  const { localSets } = useLocalStore();
  const { signAccess } = useUserStore();
  const router = useRouter();

  const user = useQuery('user', () => authApi.me(signAccess)); // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userSets = useQuery('userSets', () => setApi.getByUser(user.data!), { enabled: !!user.data }); // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userFolders = useQuery('userFolders', () => folderApi.getByUser(user.data!), { enabled: !!user.data });
  const set = useQuery('sets', () => setApi.get(user.data?.id), { enabled: !!user.data || user.isFetched });
  const folder = useQuery('folders', () => folderApi.get(user.data?.id), { enabled: !!user.data || user.isFetched });

  const [shownFolder, setShownFolder] = React.useState(false);
  const toggleShownFolder = () => setShownFolder(!shownFolder);

  const [state, setState] = React.useState<StateType>({ userSets: [], userFolders: [] });
  React.useEffect(() => {
    if (isBackendLess) setState({ userSets: localSets, userFolders: [] });
    else if (userSets.data) setState((prev) => ({ ...prev, userSets: userSets.data }));
    else if (userFolders.data) setState((prev) => ({ ...prev, userFolders: userFolders.data }));
  }, [isBackendLess, userSets.data, userFolders.data]);

  return (
    <div className={style.container}>
      <section>
        <h2>Recent study sets</h2>
        <div className={style.cardlist}>
          {state.userSets.length ? (
            state.userSets.map((content) => <CardBox key={content.id} content={content.title} id={content.id} type="set" />)
          ) : (
            <div className={style.emptyCard}>
              <p>You don&#39;t have any study sets yet</p>
              <Button onClick={() => router.push('/create-set')}>Create your first study set</Button>
            </div>
          )}
        </div>
      </section>
      <section>
        <h2>Recent folders</h2>
        <div className={style.cardlist}>
          {state.userFolders.length ? (
            state.userFolders.map((content) => <CardBox key={content.id} content={content.name} id={content.id} type="folder" />)
          ) : (
            <>
              <div className={style.emptyCard}>
                <p>You don&#39;t have any folders yet</p>
                <Button onClick={toggleShownFolder}>Create your first folder</Button>
              </div>
              <FolderForm isOpen={shownFolder} onClose={toggleShownFolder} />
            </>
          )}
        </div>
      </section>
      {set.data?.length || folder.data?.length ? (
        <section>
          <h2>Discover solutions from other users</h2>
          <div className={style.cardlist}>
            {set.data?.length
              ? set.data.map((content) => <CardBox key={content.id} content={content.title} id={content.id} type="set" />)
              : undefined}
            {folder.data?.length
              ? folder.data.map((content) => <CardBox key={content.id} content={content.name} id={content.id} type="folder" />)
              : undefined}
          </div>
        </section>
      ) : undefined}
    </div>
  );
};

export default Home;
