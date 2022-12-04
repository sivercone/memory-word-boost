import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { setApi } from 'apis/setApi';
import style from 'styles/pages/user.module.scss';
import { authApi } from 'apis/authApi';
import Custom404 from 'pages/404';
import { formatDate } from 'lib/utils';
import { folderApi } from 'apis/folderApi';
import { useUserStore } from 'storage/useUserStore';
import { CardBox } from 'ui/CardBox';

const UserPage: NextPage<{ pagekey: string }> = ({ pagekey }) => {
  const { user: userState } = useUserStore();
  const router = useRouter();
  const user = useQuery(['user', pagekey], () => authApi.getById(pagekey));
  React.useEffect(() => {
    if (router.query?.entries) return;
    router.replace(`/u/${pagekey}?entries=sets`);
  }, [pagekey]);

  // prettier-ignore
  const sets = useQuery(['sets', pagekey], 
    () => { if (user.data) return setApi.getByUser(user.data) }, { enabled: !!pagekey && !!user.data && router.query.entries === 'sets' });
  // prettier-ignore
  const folders = useQuery(['folders', pagekey],
    () => { if (user.data) return folderApi.getByUser(user.data) }, { enabled: !!pagekey && !!user.data && router.query.entries === 'folders' });

  if (!user.data) return <Custom404 />;
  return (
    <div className="container">
      <section className={style.island}>
        <div className={style.island__avatar}>
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" width="1em" viewBox="0 0 512 512" fill="currentColor">
              <path
                fill="currentColor"
                d="M89 25v462h334V25H89zm30 30h274v402H119V55zm18 18v94h49.8c1-10.8 2.3-22 4.4-34 6.4-21 24.8-43.28 45-47.7 3.9-.95 8.4 1.48 12.6 1.4 2.7 0 13.4-2.68 15.3-2.8 30.8.81 55.3 33.7 59.3 60.3.6 4.5 2 12.7 3.6 22.8h48V73H137zm112.9 31.3c-9.9 0-19.3 5.7-26.9 16.6-7.5 10.9-12.6 26.7-12.6 44.3 0 17.6 5.1 33.4 12.6 44.3 7.6 10.9 17 16.6 26.9 16.6 9.9 0 19.3-5.7 26.9-16.6 7.5-10.9 12.6-26.7 12.6-44.3 0-17.6-5.1-33.4-12.6-44.3-7.6-10.9-17-16.6-26.9-16.6zM137 185v132.8c7.6-16.4 30-32.3 35.4-46 10.6-26.8 11-54.5 13.1-86.8H137zm193 0c3.5 22.9 7.9 46.9 9.9 69.3 14.7 9.4 27.1 21.6 35.1 35.5V185h-45zm-52.7 49.7c-8 5.9-17.3 9.4-27.4 9.4-3.6 0-7.1-.5-10.5-1.3-4.1 6.7-7.8 13.9-10.9 22.1-5 12.9-17.2 19.1-27.7 26.3-7.7 7.4-25.4 14.3-18.4 27.4 9.7 12.9 37.8 14.2 50.8 14.1 19.3-2.3 44.6-1.5 59-14.1l-14.9-83.9zm-60.1 124-5.7 17.8 59.2 32.2 9.9-28.1c-12.6-12.3-36.5-17.9-63.4-21.9zm-15.6 44c-4.7 1.3-9.6 2.9-13.7 4.3-2.9 8.5-.5 18 1.7 29.8 22.3 3 37.9-8.3 54.6-18.5l-42.6-15.6z"
              />
            </svg>
          </span>
        </div>
        <div className={style.island__title}>
          <span>{user.data.name}</span>
        </div>
        {user.data.bio ? (
          <div className={style.island__bio}>
            <span>{user.data.bio}</span>
          </div>
        ) : undefined}
        <div className={style.island__bio}>
          <span>{`On project since ${formatDate({ createdAt: user.data.createdAt, pattern: 'dd MMM yyyy' })}`}</span>
        </div>
        <ul className={style.island__tabs}>
          <li className={router.query.entries === 'sets' ? style.island__tabsActive : undefined}>
            <Link href={`/u/${pagekey}?entries=sets`}>
              <a>Sets</a>
            </Link>
          </li>
          <li className={router.query.entries === 'folders' ? style.island__tabsActive : undefined}>
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
      <section style={{ margin: '0.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {
          {
            sets: {
              idle: undefined,
              error: (
                <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                  <i>Something went wrong. Failed to load content.</i>
                </div>
              ),
              loading: (
                <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                  <i>Loading..</i>
                </div>
              ),
              success: sets.data?.length ? (
                sets.data.map((content) => <CardBox key={content.id} id={content.id} content={content.title} type="set" />)
              ) : (
                <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                  <i>It looks like there is no study set here</i>
                </div>
              ),
            }[sets.status],
            folders: {
              idle: undefined,
              error: (
                <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                  <i>Something went wrong. Failed to load content.</i>
                </div>
              ),
              loading: (
                <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                  <i>Loading..</i>
                </div>
              ),
              success: folders.data?.length ? (
                folders.data.map((content) => <CardBox key={content.id} id={content.id} content={content.name} type="folder" />)
              ) : (
                <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                  <i>It looks like there is no folder here</i>
                </div>
              ),
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
