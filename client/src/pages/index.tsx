import type { NextPage } from 'next';
import Head from 'next/head';
import style from 'styles/pages/home.module.scss';
import { useQuery } from 'react-query';
import { setApi } from 'api/setApi';
import { folderApi } from 'api/folderApi';
import { CardBoxSet, CardBoxFolder } from 'components/CardBox';

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
      <div className="container">
        <div className={style.banner}>
          <h2>Getting started</h2>
          <div>
            <button className="button button_dark">Create your first study set</button>
            <button className="button button_dark">Create your first folder</button>
          </div>
        </div>
        <h2 style={{ margin: '1rem 0' }}>Study sets</h2>
        <div className={style.cardlist}>
          {set.data ? set.data.map((content) => <CardBoxSet key={content.id} content={content} />) : undefined}
        </div>
        <h2 style={{ margin: '1rem 0' }}>Folders</h2>
        <div className={style.cardlist}>
          {folder.data ? folder.data.map((content) => <CardBoxFolder key={content.id} content={content} />) : undefined}
        </div>
      </div>
    </>
  );
};

export default Home;
