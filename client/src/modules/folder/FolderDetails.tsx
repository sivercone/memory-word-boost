import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { ActionList, ButtonSquare, DropdownMenu } from '@src/ui';
import { DeleteIcon, EditIcon, MoreIcon, PersonIcon } from '@src/ui/Icons';
import { FolderInterface } from '@src/interfaces';
import { setApi } from '@src/apis';
import { FolderForm } from './FolderForm';
import { FolderDelete } from './FolderDelete';

const FolderDetails: NextPage<{ queryId: string; queryUser: string; data: FolderInterface | null }> = ({
  queryId,
  queryUser,
  data: folder,
}) => {
  const router = useRouter();
  const [shownModal, setShownModal] = React.useState<'edit' | 'del' | null>(null);
  React.useEffect(() => {
    if (queryId === 'new') setShownModal('edit');
  }, [queryId]);

  const menuOptions = [
    { title: 'Author', action: () => router.push(`/user/${folder?.user.id}`), icon: <PersonIcon /> },
    { title: 'Edit', action: () => setShownModal('edit'), icon: <EditIcon /> },
    { title: 'Delete', action: () => setShownModal('del'), icon: <DeleteIcon /> },
  ];

  const { data: userSets = [] } = useQuery('userSets', () => setApi.getByUser(String(queryUser)), { enabled: Boolean(queryUser) });

  return (
    <>
      {!queryUser && (
        <div className="bg-white py-8 border-b border-b-gray-200">
          <div className="max-w-3xl mx-auto flex flex-col gap-4 px-4">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-md bg-white border border-solid border-gray-200" />
              <div>
                <h1 className="text-2xl font-medium">{folder?.name || 'New Folder'}</h1>
                {folder?.description ? <p className="leading-relaxed text-gray-600">{folder.description}</p> : null}
              </div>
            </div>
            <DropdownMenu
              options={menuOptions}
              trigger={
                <ButtonSquare title="Actions">
                  <MoreIcon />
                </ButtonSquare>
              }
              keyExtractor={(item) => item.title}
              renderItem={(item) => (
                <DropdownMenu.Item onClick={item.action} className="justify-between">
                  <span>{item.title}</span>
                  {item.icon}
                </DropdownMenu.Item>
              )}
            />
          </div>
        </div>
      )}

      {folder && <FolderDelete data={folder} open={shownModal === 'del'} setOpen={() => setShownModal(null)} />}

      <div className="p-4 max-w-3xl mx-auto">
        <ActionList
          header={{ title: 'Sets' }}
          placeholder={'Nothing yet'}
          data={queryId !== 'new' ? folder?.sets || userSets : []}
          keyExtractor={(item) => item.id}
          renderItem={(item, index) => (
            <ActionList.Link href={`/sets/${item.id}`} isFirst={index === 0}>
              {item.name}
            </ActionList.Link>
          )}
        />
      </div>

      <FolderForm
        data={folder && queryId !== 'new' ? folder : undefined}
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
