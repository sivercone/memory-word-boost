import { NextPage } from 'next';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { authApi, folderApi } from '@src/apis';
import Custom404 from 'pages/404';
import { formatDate } from '@src/lib/utils';
import { ActionList } from '@src/ui/ActionList';
import Link from 'next/link';

const UserPage: NextPage<{ pagekey: string }> = ({ pagekey }) => {
  const user = useQuery(['user', pagekey], () => authApi.getById(pagekey));

  const folders = useQuery(
    ['folders', pagekey],
    () => {
      if (user.data) return folderApi.getByUser(user.data.id);
    },
    { enabled: !!pagekey && !!user.data },
  );

  if (!user.data) return <Custom404 />;
  return (
    <>
      <div className="bg-white py-8 border-b border-b-gray-200">
        <div className="max-w-4xl mx-auto flex flex-col gap-4 px-4">
          <div>
            <h1 className="text-3xl">{user.data.name}</h1>
            <p className="leading-relaxed text-gray-600">{`On project since ${formatDate({
              createdAt: user.data.createdAt,
              pattern: 'dd MMM yyyy',
            })}`}</p>
          </div>
          <Link href={`/u/${pagekey}/settings`}>
            <a className="border border-gray-200 border-solid w-full p-2 rounded-lg flex items-center justify-center">Edit</a>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl mb-4">Folders</h2>
        <ActionList
          data={folders.data || []}
          keyExtractor={(item) => item.id}
          renderItem={(item, index) => (
            <ActionList.Link href={`/sets?folder=${item.id}`} isFirst={index === 0}>
              <a>{item.name}</a>
            </ActionList.Link>
          )}
        />
      </div>
    </>
  );
};

UserPage.getInitialProps = async ({ query }) => {
  const pagekey = typeof query.user === 'string' ? query.user : '';
  const queryClient = new QueryClient();
  if (pagekey) await queryClient.prefetchQuery(['user', pagekey], () => authApi.getById(pagekey));
  return { pagekey, dehydratedState: dehydrate(queryClient) };
};

export default UserPage;
