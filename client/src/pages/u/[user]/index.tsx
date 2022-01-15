import { setApi } from 'api/setApi';
import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import { useQuery } from 'react-query';
import style from 'styles/pages/user.module.scss';
import s from 'styles/pages/home.module.scss';
import { authApi } from 'api/authApi';
import Custom404 from 'pages/404';
import { formatDate } from 'utils/formatDate';

const User: NextPage = () => {
  const set = useQuery('sets', setApi.get);

  const user = useQuery(['user'], () => authApi.me());

  if (!user.data) return <Custom404 />;

  return (
    <div className="container">
      <section className={style.header}>
        <div className={style.header__avatar}>
          <img src={user.data.avatar} alt="" />
        </div>
        <div className={style.header__title}>
          <span>{user.data.name}</span>
        </div>
        <div className={style.header__bio}>
          <span>Software Engineer</span>
        </div>
        <div className={style.header__bio}>
          <span>{`On project since ${formatDate({ createdAt: user.data.createdAt, pattern: 'dd MMM yyyy' })}`}</span>
        </div>
        <ul className={style.header__tabs}>
          <li className={style.header__tabsActive}>Sets</li>
          <li>Folders</li>
          <li>Edit profile</li>
        </ul>
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
