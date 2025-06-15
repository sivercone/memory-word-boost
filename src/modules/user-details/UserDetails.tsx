import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useState } from 'react';

import UserForm from '../user-form';
import { utils } from '@src/lib';
import { useLocalStore } from '@src/stores';
import * as Types from '@src/types';
import { ActionList, Button, Spinner, Icons } from '@src/ui';

const UserProfile: React.FC<{ data: Types.UserModel; onEdit?: () => void }> = ({ data, onEdit }) => (
  <div className="border-b border-b-outline bg-surface py-8">
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 flex-shrink-0 rounded-full border border-solid border-outline bg-surface" />
        <div>
          <h1 className="text-2xl font-medium text-onSurface">{data.name}</h1>
          <p className="text-sm leading-relaxed text-onBackground">
            {`On project since ${dayjs(data.createdAt).format('D MMM YYYY')}`}
          </p>
          {data.bio ? <p className="leading-relaxed text-onBackground">{data.bio}</p> : null}
        </div>
      </div>
      {typeof onEdit === 'function' && <Button onClick={onEdit}>Edit</Button>}
    </div>
  </div>
);

const UserFolders: React.FC<{ userId: string }> = ({ userId }) => {
  const localStore = useLocalStore();
  const sortedFolders = utils.array.composeSortedFolders(localStore.folders.filter((item) => item.userId === userId));

  if (!sortedFolders.length) return <Spinner center className="m-8 h-8" />;
  return (
    <div className="mx-auto max-w-3xl p-4">
      <ActionList
        header={{ title: 'Folders' }}
        data={sortedFolders}
        keyExtractor={(item) => item.id}
        renderItem={(item, index) => (
          <ActionList.Link href={`/sets?${item.id === 'sets' ? `user=${userId}` : `folder=${item.id}`}`} isFirst={index === 0}>
            <Icons.Folder className="flex-shrink-0" />
            <span>{item.name}</span>
          </ActionList.Link>
        )}
      />
    </div>
  );
};

const UserDetails = () => {
  const { query } = useRouter();
  const { users, userId } = useLocalStore();
  const activeUser = users.find((user) => user.id === query.id);
  const [edit, setEdit] = useState(false);

  if (!activeUser) return;
  return (
    <>
      <UserProfile data={activeUser} onEdit={activeUser.id === userId ? () => setEdit(true) : undefined} />
      <UserForm data={activeUser} open={edit} close={() => setEdit(false)} />
      <UserFolders userId={String(query.id)} />
    </>
  );
};

export default UserDetails;
