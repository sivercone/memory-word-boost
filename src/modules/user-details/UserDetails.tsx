import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import ProfileForm from '../user-form';
import { useLocalStore } from '@src/stores';
import * as Types from '@src/types';
import { ActionList, Button, Spinner, Icons } from '@src/ui';

const UserProfile: React.FC<{ user: Types.UserModel; onEdit: () => void }> = ({ user, onEdit }) => (
  <div className="bg-white py-8 border-b border-b-gray-200">
    <div className="max-w-3xl mx-auto flex flex-col gap-4 px-4">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-full bg-white border border-solid border-gray-200" />
        <div>
          <h1 className="text-2xl font-medium">{user.name}</h1>
          <p className="leading-relaxed text-gray-600 text-sm">{`On project since ${dayjs(user.createdAt).format('d MMM YYYY')}`}</p>
          {user.bio ? <p className="leading-relaxed text-gray-600">{user.bio}</p> : null}
        </div>
      </div>
      <Button onClick={onEdit}>Edit</Button>
    </div>
  </div>
);

const UserFolders: React.FC<{ userId: string }> = ({ userId }) => {
  const localStore = useLocalStore();
  const userFolders = localStore.folders.filter((item) => item.userId === userId);
  const sortedFolders = [...userFolders, { id: userId, name: 'Sets' }].sort((a, b) =>
    a.name === 'Sets' ? -1 : b.name === 'Sets' ? 1 : a.name.localeCompare(b.name),
  );

  if (!sortedFolders.length) return <Spinner center className="m-8 h-8" />;
  return (
    <div className="max-w-3xl mx-auto p-4">
      <ActionList
        header={{ title: 'Folders' }}
        data={sortedFolders}
        keyExtractor={(item) => item.id}
        renderItem={(item, index) => (
          <ActionList.Link href={`/sets?${item.id === userId ? 'user' : 'folder'}=${item.id}`} isFirst={index === 0}>
            <Icons.Folder />
            <span>{item.name}</span>
          </ActionList.Link>
        )}
      />
    </div>
  );
};

const UserDetails = () => {
  const params = useParams<{ id: string }>();
  const localStore = useLocalStore();
  const [edit, setEdit] = useState(false);

  return (
    <>
      {localStore.user && <UserProfile user={localStore.user} onEdit={() => setEdit(true)} />}
      <ProfileForm open={edit} setOpen={setEdit} />
      <UserFolders userId={params.id} />
    </>
  );
};

export default UserDetails;
