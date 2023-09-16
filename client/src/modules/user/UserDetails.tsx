import React from 'react';
import { NextPage } from 'next';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { authApi, folderApi } from '@src/apis';
import Custom404 from '@src/pages/404';
import { formatDate } from '@src/lib/utils';
import { ActionList } from '@src/ui/ActionList';
import ProfileForm from '@src/modules/user/ProfileForm';
import { FolderInterface, UserInterface } from '@src/interfaces';
import { Spinner } from '@src/ui/Spinner';

const UserProfile: React.FC<{ user: UserInterface; onEdit: () => void }> = ({ user, onEdit }) => (
  <div className="bg-white py-8 border-b border-b-gray-200">
    <div className="max-w-3xl mx-auto flex flex-col gap-4 px-4">
      <div>
        <h1 className="text-3xl">{user.name}</h1>
        <p className="leading-relaxed text-gray-600 text-sm">
          On project since {formatDate({ createdAt: user.createdAt, pattern: 'dd MMM yyyy' })}
        </p>
        {user.bio ? <p className="leading-relaxed text-gray-600">{user.bio}</p> : null}
      </div>
      <button onClick={onEdit} className="border border-gray-200 border-solid w-full p-2 rounded-lg flex items-center justify-center">
        Edit
      </button>
    </div>
  </div>
);

const UserFolders: React.FC<{ folders: FolderInterface[] }> = ({ folders }) => (
  <div className="max-w-3xl mx-auto p-4">
    <h2 className="text-2xl mb-4">Folders</h2>
    <ActionList
      data={folders}
      keyExtractor={(item) => item.id}
      renderItem={(item, index) => (
        <ActionList.Link href={`/sets?folder=${item.id}`} isFirst={index === 0}>
          <a>{item.name}</a>
        </ActionList.Link>
      )}
    />
  </div>
);

const UserDetails: NextPage<{ queryId: string }> = ({ queryId }) => {
  const [edit, setEdit] = React.useState(false);
  const { data: user, isLoading: userLoading } = useQuery(['user', queryId], () => authApi.getById(queryId));
  const { data: folders = [], isLoading: folderLoading } = useQuery(['folders', queryId], () => user && folderApi.getByUser(user.id), {
    enabled: !!user,
  });

  if (userLoading || folderLoading) return <Spinner className="mx-auto m-8 h-8" />;
  if (!user) return <Custom404 />;

  return (
    <>
      <UserProfile user={user} onEdit={() => setEdit(true)} />
      <ProfileForm open={edit} setOpen={setEdit} />
      <UserFolders folders={folders} />
    </>
  );
};

UserDetails.getInitialProps = async ({ query }) => {
  const queryId = typeof query.id === 'string' ? query.id : '';
  const queryClient = new QueryClient();
  if (queryId) await queryClient.prefetchQuery(['user', queryId], () => authApi.getById(queryId));
  return { queryId, dehydratedState: dehydrate(queryClient) };
};

export default UserDetails;
