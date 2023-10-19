import React from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { ArrowLeftIcon } from '@src/ui/Icons';
import { useSetStore } from '@src/stores';
import { ActionList, ButtonSquare } from '@src/ui';
import { authApi, folderApi } from '@src/apis';

const Folders: React.FC = () => {
  const router = useRouter();
  const { setCurrStudySet, currStudySet } = useSetStore();

  const user = useQuery('user', () => authApi.me()); // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userFolders = useQuery('userFolders', () => folderApi.getByUser(user.data!.id), { enabled: !!user.data });
  const folders = [...(userFolders.data || []), { id: 'sets', name: 'Sets' }];

  const onSelect = (id: string) => {
    // setCurrStudySet({ folders: [] }); // change logic to have only one folder
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4 py-4 px-4">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-medium">Folders</h1>
        <div className="ml-auto flex items-center gap-4">
          <ButtonSquare href={{ pathname: router.pathname, query: currStudySet?.id && { id: router.query.id } }} title="Back">
            <ArrowLeftIcon />
          </ButtonSquare>
        </div>
      </div>

      <ActionList
        data={folders}
        keyExtractor={(item) => item.id}
        renderItem={(item, index) => (
          <ActionList.Button onClick={() => onSelect(item.id)} isFirst={index === 0}>
            {item.name}
          </ActionList.Button>
        )}
      />
    </div>
  );
};

export default Folders;
