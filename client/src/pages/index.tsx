import type { NextPage } from 'next';
import Head from 'next/head';
import style from 'styles/pages/home.module.scss';
import { useQuery } from 'react-query';
import { setApi } from 'api/setApi';
import { folderApi } from 'api/folderApi';
import React from 'react';
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
        <h1 style={{ marginBottom: '1rem' }}>Study sets</h1>
        <div className={style.cardlist}>
          {set.data ? set.data.map((content) => <CardBoxSet key={content.id} content={content} />) : undefined}
        </div>
        <h1 style={{ marginBottom: '1rem' }}>Folders</h1>
        <div className={style.cardlist}>
          {folder.data ? folder.data.map((content) => <CardBoxFolder key={content.id} content={content} />) : undefined}
        </div>
      </div>
    </>
  );
};

export default Home;
