import React from 'react';
import { NextPage } from 'next';
import { useQuery } from 'react-query';
import { folderApi } from '@src/apis';
import { formatDate } from '@src/lib/utils';
import { ActionList, ButtonSquare, Spinner } from '@src/ui';
import { UserInterface } from '@src/interfaces';
import ProfileForm from './ProfileForm';

const UserProfile: React.FC<{ user: UserInterface; onEdit: () => void }> = ({ user, onEdit }) => (
  <div className="bg-white py-8 border-b border-b-gray-200">
    <div className="max-w-3xl mx-auto flex flex-col gap-4 px-4">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-full bg-white border border-solid border-gray-200" />
        <div>
          <h1 className="text-2xl font-medium">{user.name}</h1>
          <p className="leading-relaxed text-gray-600 text-sm">
            On project since {formatDate({ createdAt: user.createdAt, pattern: 'dd MMM yyyy' })}
          </p>
          {user.bio ? <p className="leading-relaxed text-gray-600">{user.bio}</p> : null}
        </div>
      </div>
      <ButtonSquare onClick={onEdit}>Edit</ButtonSquare>
    </div>
  </div>
);

const UserFolders: React.FC<{ userId: string }> = ({ userId }) => {
  const { data = [], isLoading } = useQuery(['folders', userId], () => folderApi.getByUser(userId), { enabled: !!userId });

  if (isLoading) return <Spinner className="mx-auto m-8 h-8" />;
  return (
    <div className="max-w-3xl mx-auto p-4">
      <ActionList
        header={{ title: 'Folders' }}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={(item, index) => (
          <ActionList.Link href={`/sets?folder=${item.id}`} isFirst={index === 0}>
            {item.name}
          </ActionList.Link>
        )}
      />
    </div>
  );
};

const UserDetails: NextPage<{ queryId: string; data: UserInterface }> = ({ data: user }) => {
  const [edit, setEdit] = React.useState(false);

  return (
    <>
      <UserProfile user={user} onEdit={() => setEdit(true)} />
      <ProfileForm open={edit} setOpen={setEdit} />
      <UserFolders userId={user.id} />
    </>
  );
};

export default UserDetails;
