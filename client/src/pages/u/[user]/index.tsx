import { setApi } from 'api/setApi';
import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import { useQuery } from 'react-query';
import style from 'styles/pages/user.module.scss';
import s from 'styles/pages/home.module.scss';

const User: NextPage = () => {
  const set = useQuery('sets', setApi.get);

  return (
    <div className="container">
      <section className={style.header}>
        <div className={style.header__cover}>{/* <img src="/assets/download.webp" alt="" /> */}</div>
        <div className={style.header__wrapper}>
          <div className={style.header__avatar}>
            <img src="/assets/rei.jpg" alt="" />
          </div>
          <div className={style.header__title}>
            <span>Danylo Trofimenko</span>
          </div>
          <div className={style.header__bio}>
            <span>Software Engineer</span>
          </div>
          <div className={style.header__bio}>
            <span>On project since 24 nov 2021</span>
          </div>
          <ul className={style.header__tabs}>
            <li className={style.header__tabsActive}>Sets</li>
            <li>Folders</li>
            <li>Edit profile</li>
          </ul>
        </div>
      </section>
      <section style={{ marginTop: '1rem' }} className={s.cardlist}>
        {set.data
          ? set.data.map((content) => (
              <Link href={`/${content.id}`} key={content.id}>
                <a style={{ width: '100%' }} className={s.cardlist__item}>
                  <div className={s.cardlist__text}>
                    <h2>{content.title}</h2>
                    <p>{content.description}</p>
                  </div>
                  <ul className={s.cardlist__tags}>
                    {content.tags.map((tag, i) => (
                      <li key={tag + i}>{tag}</li>
                    ))}
                  </ul>
                </a>
              </Link>
            ))
          : undefined}
      </section>
    </div>
  );
};

export default User;
