import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import style from 'styles/pages/home.module.scss';
import { useQuery } from 'react-query';
import { setApi } from 'api/setApi';

// https://quizlet.com/upgrade?source=rich_text_formatting

const Home: NextPage = () => {
   const set = useQuery('sets', setApi.getSets);

   return (
      <>
         <Head>
            <title>Memory Word Boost</title>
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <div className="container">
            <div className={style.cardlist}>
               {set.data
                  ? set.data.map((content) => (
                       <Link href={`/${content._id}`} key={content._id}>
                          <a className={style.cardlist__item}>
                             <div className={style.cardlist__text}>
                                <h2>{content.title}</h2>
                                <p>{content.description}</p>
                             </div>
                             <ul className={style.cardlist__tags}>
                                {content.tags.map((tag, i) => (
                                   <li key={tag + i}>{tag}</li>
                                ))}
                             </ul>
                          </a>
                       </Link>
                    ))
                  : undefined}
            </div>
         </div>
      </>
   );
};

export default Home;
