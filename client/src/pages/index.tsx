import React from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { setApi } from 'apis/setApi';
import { folderApi } from 'apis/folderApi';
import { authApi } from 'apis/authApi';
import { useUserStore } from 'storage/useUserStore';
import { useLocalStore } from 'storage/useLocalStore';
import { CardBox } from 'ui/CardBox';
import { Button } from 'ui/Button';
import { isBackendLess } from 'lib/staticData';
import { FolderForm } from 'modules/FolderForm';
import { FolderInterface, SetInterface } from 'interfaces';
import style from 'styles/pages/home.module.scss';

type TabsOptions = 'sets' | 'folders';
type TabsProps = { onTabSelect: React.Dispatch<React.SetStateAction<TabsOptions>>; selectedTab: TabsOptions };
type StateType = { userSets: SetInterface[]; userFolders: FolderInterface[] };

const Home: NextPage = () => {
  const [selectedTab, setSelectedTab] = React.useState<TabsOptions>('sets');

  return (
    <div className={style.container}>
      <Tabs onTabSelect={setSelectedTab} selectedTab={selectedTab} />
      <DisplayData selectedTab={selectedTab} />
    </div>
  );
};

const Tabs: React.FC<TabsProps> = ({ onTabSelect, selectedTab }) => {
  return (
    <div className={style.toggle}>
      <button onClick={() => onTabSelect('sets')} className={selectedTab === 'sets' ? style.toggle__active : undefined}>
        Sets
      </button>
      <button onClick={() => onTabSelect('folders')} className={selectedTab === 'folders' ? style.toggle__active : undefined}>
        Folders
      </button>
    </div>
  );
};

const DisplayData: React.FC<{ selectedTab: TabsOptions }> = ({ selectedTab }) => {
  const router = useRouter();
  const { signAccess } = useUserStore();
  const { localSets } = useLocalStore();
  const [shownFolder, setShownFolder] = React.useState(false);
  const toggleShownFolder = () => setShownFolder(!shownFolder);

  const user = useQuery('user', () => authApi.me(signAccess)); // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userSets = useQuery('userSets', () => setApi.getByUser(user.data!), { enabled: !!user.data }); // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userFolders = useQuery('userFolders', () => folderApi.getByUser(user.data!), { enabled: !!user.data });
  const set = useQuery('sets', () => setApi.get(user.data?.id), { enabled: !!user.data || user.isFetched });
  const folder = useQuery('folders', () => folderApi.get(user.data?.id), { enabled: !!user.data || user.isFetched });

  const [state, setState] = React.useState<StateType>({ userSets: [], userFolders: [] });
  React.useEffect(() => {
    if (isBackendLess) setState({ userSets: localSets, userFolders: [] });
    if (userSets.data) setState((prev) => ({ ...prev, userSets: userSets.data }));
    if (userFolders.data) setState((prev) => ({ ...prev, userFolders: userFolders.data }));
  }, [isBackendLess, userSets.data, userFolders.data]);

  return (
    <>
      {selectedTab === 'sets' ? (
        <>
          <section>
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
            <h2>{isBackendLess ? 'Discover sample solutions' : 'Discover solutions from other users'}</h2>
            <div className={style.cardlist}>
              {set.data?.length
                ? set.data.map((content) => <CardBox key={content.id} content={content.title} id={content.id} type="set" />)
                : undefined}
            </div>
          </section>
        </>
      ) : undefined}
      {selectedTab === 'folders' ? (
        <>
          <section>
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
          <section>
            <h2>{isBackendLess ? 'Discover sample solutions' : 'Discover solutions from other users'}</h2>
            <div className={style.cardlist}>
              {folder.data?.length
                ? folder.data.map((content) => <CardBox key={content.id} content={content.name} id={content.id} type="folder" />)
                : undefined}
            </div>
          </section>
        </>
      ) : undefined}
    </>
  );
};

export default Home;
