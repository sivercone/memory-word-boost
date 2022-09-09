import type { NextPage } from 'next';
import Head from 'next/head';
import style from 'styles/pages/home.module.scss';
import { useQuery } from 'react-query';
import { setApi } from 'api/setApi';
import { folderApi } from 'api/folderApi';
import { CardBoxSet, CardBoxFolder } from 'components/CardBox';
import { Button } from 'ui/Button';

// https://quizlet.com/upgrade?source=rich_text_formatting

const Home: NextPage = () => {
  const set = useQuery('sets', setApi.get);
  const folder = useQuery('folders', folderApi.get);

  return (
    <>
      <Head>
        <title>Memory Word Boost</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={style.container}>
        {/* <div className={style.banner}>
          <div className={style.banner__inner}>
            <h2>Getting started</h2>
            <div>
              <Button>Create your first study set</Button>
              <Button>Create your first folder</Button>
            </div>
          </div>
        </div> */}
        <section>
          <h2>Recent study sets</h2>
          <div className={style.cardlist}>
            {set.data ? set.data.map((content) => <CardBoxSet key={content.id} content={content} />) : undefined}
          </div>
        </section>
        <section>
          <h2>Recent folders</h2>
          <div className={style.cardlist}>
            {folder.data ? folder.data.map((content) => <CardBoxFolder key={content.id} content={content} />) : undefined}
          </div>
        </section>
        <section>
          <h2>Discover solutions from other users</h2>
          <div className={style.cardlist}>
            {folder.data ? folder.data.map((content) => <CardBoxFolder key={content.id} content={content} />) : undefined}
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
