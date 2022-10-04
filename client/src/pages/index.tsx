import React from 'react';
import type { NextPage } from 'next';
import { useQuery } from 'react-query';
import { setApi } from 'apis/setApi';
import { folderApi } from 'apis/folderApi';
import { useUserStore } from 'storage/useUserStore';
import { CardBox } from 'ui/CardBox';
import { Button } from 'ui/Button';
import style from 'styles/pages/home.module.scss';
import { useRouter } from 'next/router';
import { FolderEditing } from 'modules/FolderEditing';

const Home: NextPage = () => {
  const router = useRouter();
  const { user } = useUserStore();
  // prettier-ignore
  const userSets = useQuery('userSets', () => { if (user) return setApi.getByUser(user) }, { enabled: !!user });
  // prettier-ignore
  const userFolders = useQuery('userFolders', () => { if (user) return folderApi.getByUser(user) }, { enabled: !!user });
  const set = useQuery('sets', () => setApi.get(user?.id));
  const folder = useQuery('folders', () => folderApi.get(user?.id));

  const [shownFolder, setShownFolder] = React.useState(false);
  const toggleShownFolder = () => setShownFolder(!shownFolder);

  return (
    <div className={style.container}>
      <section>
        <h2>Recent study sets</h2>
        <div className={style.cardlist}>
          {userSets.data?.length ? (
            userSets.data.map((content) => <CardBox key={content.id} content={content.title} id={content.id} type="set" />)
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
          {userFolders.data?.length ? (
            userFolders.data.map((content) => <CardBox key={content.id} content={content.name} id={content.id} type="folder" />)
          ) : (
            <>
              <div className={style.emptyCard}>
                <p>You don&#39;t have any folders yet</p>
                <Button onClick={toggleShownFolder}>Create your first folder</Button>
              </div>
              <FolderEditing isOpen={shownFolder} onClose={toggleShownFolder} />
            </>
          )}
        </div>
      </section>
      <section>
        <h2>Discover solutions from other users</h2>
        <div className={style.cardlist}>
          {set.data
            ? set.data.map((content) => <CardBox key={content.id} content={content.title} id={content.id} type="set" />)
            : undefined}
          {folder.data
            ? folder.data.map((content) => <CardBox key={content.id} content={content.name} id={content.id} type="folder" />)
            : undefined}
        </div>
      </section>
    </div>
  );
};

export default Home;
