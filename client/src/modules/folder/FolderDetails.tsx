import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FolderForm } from '@src/modules/folder/FolderForm';
import { FolderDelete } from '@src/modules/folder/FolderDelete';
import { ActionList } from '@src/ui/ActionList';
import { MoreIcon } from '@src/ui/Icons';
import { DropdownMenu } from '@src/ui';
import { FolderInterface } from '@src/interfaces';

const FolderDetails: NextPage<{ queryId: string; data: FolderInterface }> = ({ queryId, data: folder }) => {
  const router = useRouter();
  const [shownModal, setShownModal] = React.useState<'edit' | 'del' | null>(null);

  const menuOptions = [
    { title: 'Author', action: () => router.push(`/user/${folder?.user.id}`) },
    { title: 'Edit', action: () => setShownModal('edit') },
    { title: 'Delete', action: () => setShownModal('del') },
  ];

  React.useEffect(() => {
    if (queryId === 'new') setShownModal('edit');
  }, [queryId]);

  return (
    <>
      {folder ? (
        <>
          <div className="bg-white py-8 border-b border-b-gray-200">
            <div className="max-w-3xl mx-auto flex flex-col gap-4 px-4">
              <h1 className="text-3xl">{folder.name}</h1>
              <DropdownMenu
                options={menuOptions}
                trigger={
                  <button className="border border-gray-200 border-solid w-full p-2 rounded-lg flex items-center justify-center">
                    <MoreIcon />
                  </button>
                }
                keyExtractor={(item) => item.title}
                renderItem={(item) => (
                  <DropdownMenu.Item onClick={item.action}>
                    <span>{item.title}</span>
                  </DropdownMenu.Item>
                )}
              />
            </div>
          </div>

          <div className="p-4 max-w-3xl mx-auto">
            <h2 className="text-2xl mb-4">Sets</h2>
            <ActionList
              placeholder={'Nothing yet'}
              data={folder.sets}
              keyExtractor={(item) => item.id}
              renderItem={(item, index) => (
                <ActionList.Link href={`/sets/${item.id}`} isFirst={index === 0}>
                  {item.title}
                </ActionList.Link>
              )}
            />
          </div>
          <FolderDelete data={folder} open={shownModal === 'del'} setOpen={() => setShownModal(null)} />
        </>
      ) : null}

      <FolderForm
        data={folder}
        open={shownModal === 'edit'}
        setOpen={() => {
          if (queryId === 'new') router.push('/');
          else setShownModal(null);
        }}
      />
    </>
  );
};

export default FolderDetails;
