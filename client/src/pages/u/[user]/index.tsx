import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import Avatar from 'boring-avatars';
import { setApi } from 'api/setApi';
import style from 'styles/pages/user.module.scss';
import { authApi } from 'api/authApi';
import Custom404 from 'pages/404';
import { formatDate } from 'utils/formatDate';
import { folderApi } from 'api/folderApi';
import { CardBoxFolder, CardBoxSet } from 'components/CardBox';
import { useUserStore } from 'storage/useUserStore';

const UserPage: NextPage<{ pagekey: string }> = ({ pagekey }) => {
  const { user: userState } = useUserStore();
  const router = useRouter();
  const user = useQuery(['user', pagekey], () => authApi.getById(pagekey));
  React.useEffect(() => {
    if (router.query?.entries) return;
    router.replace(`/u/${pagekey}?entries=sets`);
  }, [pagekey]);

  const sets = useQuery(
    ['sets', pagekey],
    () => {
      if (user.data) return setApi.getByUser(user.data);
    },
    { enabled: !!pagekey && !!user.data && router.query.entries === 'sets' },
  );
  const folders = useQuery(
    ['folders', pagekey],
    () => {
      if (user.data) return folderApi.getByUser(user.data);
    },
    { enabled: !!pagekey && !!user.data && router.query.entries === 'folders' },
  );

  if (!user.data) return <Custom404 />;
  return (
    <div className="container">
      <section className={style.header}>
        <div className={style.header__avatar}>
          <Avatar size={'100%'} variant="ring" colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']} />
        </div>
        <div className={style.header__title}>
          <span>{user.data.name}</span>
        </div>
        {user.data.bio ? (
          <div className={style.header__bio}>
            <span>{user.data.bio}</span>
          </div>
        ) : undefined}
        <div className={style.header__bio}>
          <span>{`On project since ${formatDate({ createdAt: user.data.createdAt, pattern: 'dd MMM yyyy' })}`}</span>
        </div>
        <ul className={style.header__tabs}>
          <li className={router.query.entries === 'sets' ? style.header__tabsActive : undefined}>
            <Link href={`/u/${pagekey}?entries=sets`}>
              <a>Sets</a>
            </Link>
          </li>
          <li className={router.query.entries === 'folders' ? style.header__tabsActive : undefined}>
            <Link href={`/u/${pagekey}?entries=folders`}>
              <a>Folders</a>
            </Link>
          </li>
          {user.data.id === userState?.id ? (
            <li>
              <Link href={`/u/${pagekey}/settings`}>
                <a>Edit profile</a>
              </Link>
            </li>
          ) : undefined}
        </ul>
      </section>
      <section style={{ margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {
          {
            sets: {
              idle: undefined,
              error: 'error',
              loading: 'loading',
              success: sets.data?.map((content) => <CardBoxSet key={content.id} content={content} />),
            }[sets.status],
            folders: {
              idle: undefined,
              error: 'error',
              loading: 'loading',
              success: folders.data?.map((content) => <CardBoxFolder key={content.id} content={content} />),
            }[folders.status],
          }[router.query.entries as 'sets' | 'folders']
        }
      </section>
    </div>
  );
};

UserPage.getInitialProps = async ({ query }) => {
  const pagekey = typeof query.user === 'string' ? query.user : '';
  const queryClient = new QueryClient();
  if (pagekey) await queryClient.prefetchQuery(['user', pagekey], () => authApi.getById(pagekey));
  return { pagekey, dehydratedState: dehydrate(queryClient) };
};

export default UserPage;
