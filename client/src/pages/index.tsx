import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import db from "utils/db.json";
import style from "styles/pages/home.module.scss";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Memory Word Boost</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container">
        <div className={style.cardlist}>
          {db.words.map((content) => (
            <Link href={`/card/${content.id}`} key={content.id}>
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
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
