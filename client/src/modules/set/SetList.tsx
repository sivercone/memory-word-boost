import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient, useMutation, useQuery, useQueryClient } from 'react-query';
import { folderApi } from 'apis/folderApi';
import { setApi } from 'apis/setApi';
import { notify } from 'lib/notify';
import { shareValue } from 'lib/utils';
import { useUserStore } from 'storage/useUserStore';
import { Modal, ModalActions, ModalBody, ModalList } from 'ui/Modal';
import { Toggle } from 'ui/Toggle';
import { BottomSheet, useBottomSheet } from 'ui/BottomSheet';
import { FolderInterface, SetInterface } from 'interfaces';
import { FolderForm } from 'modules/FolderForm';
import Custom404 from 'pages/404';
import { ActionList } from '@src/ui/ActionList';

type ModalVariants = 'edit' | 'del' | 'sets';

const SetList: NextPage<{ pagekey: string }> = ({ pagekey }) => {
  const router = useRouter();
  const { user, signAccess } = useUserStore();
  const queryClient = useQueryClient();

  const { toggleSheet, isSheetVisible } = useBottomSheet();
  const [shownModal, setShownModal] = React.useState<ModalVariants>();
  const openModal = (payload: ModalVariants) => {
    toggleSheet(false);
    setShownModal(payload);
  };
  const closeModal = () => {
    setIncludedSets(currFolder?.sets || []);
    setShownModal(undefined);
  };

  const folder = useQuery(['folder', pagekey], () => folderApi.getById(pagekey), { enabled: !!pagekey }); // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userSets = useQuery('userSets', () => setApi.getByUser(user!.id), {
    enabled: shownModal === 'sets' && !!user,
  });
  const sets = userSets.data;

  const [currFolder, setCurrFolder] = React.useState<FolderInterface>();
  React.useEffect(() => {
    if (folder.data) {
      setCurrFolder(folder.data);
      setIncludedSets(folder.data.sets || []);
    }
  }, [folder.data]);

  const fetchDelete = useMutation(folderApi.delete, {
    onSuccess: () => {
      notify('Successfully deleted folder');
      queryClient.invalidateQueries('userFolders');
      return router.push('/');
    },
  });
  const onDelete = async () => {
    if (!currFolder) return;
    await fetchDelete.mutateAsync({ id: currFolder.id, token: signAccess }).catch(() => null);
  };

  const [includedSets, setIncludedSets] = React.useState<SetInterface[]>([]);
  const toggleIncludeFolder = (payload: SetInterface) => {
    if (includedSets.find((set) => set.id === payload.id)) setIncludedSets(includedSets.filter((el) => el.id !== payload.id));
    else setIncludedSets([...includedSets, payload]);
  };

  const fetchUpdate = useMutation(folderApi.save, { onSuccess: () => queryClient.invalidateQueries(['folder', pagekey]) });
  const updateFolderSets = async () => {
    if (!currFolder) return;
    await fetchUpdate.mutateAsync({ data: { ...currFolder, sets: includedSets }, token: signAccess }).catch(() => null);
    closeModal();
  };

  const menuOptions = [
    { title: 'Information', action: () => openModal('edit') },
    { title: 'Share', action: () => shareValue(window.location.href) },
    { title: 'Author', action: () => router.push(`/user/${currFolder?.user.id}`) },
    { title: 'Edit', action: () => openModal('edit') },
    { title: 'Delete', action: () => openModal('del') },
  ];

  if (!currFolder) return <Custom404 />;
  return (
    <>
      <div className="bg-white py-8 border-b border-b-gray-200">
        <div className="max-w-3xl mx-auto flex flex-col gap-4 px-4">
          <h1 className="text-3xl">{currFolder.name}</h1>
          <button
            onClick={() => toggleSheet()}
            className="border border-gray-200 border-solid w-full p-2 rounded-lg flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className="fill-gray-600">
              <path d="M249.231-420.001q-24.749 0-42.374-17.625-17.624-17.625-17.624-42.374 0-24.749 17.624-42.374 17.625-17.625 42.374-17.625 24.75 0 42.374 17.625Q309.23-504.749 309.23-480q0 24.749-17.625 42.374-17.624 17.625-42.374 17.625Zm230.769 0q-24.749 0-42.374-17.625-17.625-17.625-17.625-42.374 0-24.749 17.625-42.374 17.625-17.625 42.374-17.625 24.749 0 42.374 17.625 17.625 17.625 17.625 42.374 0 24.749-17.625 42.374-17.625 17.625-42.374 17.625Zm230.769 0q-24.75 0-42.374-17.625Q650.77-455.251 650.77-480q0-24.749 17.625-42.374 17.624-17.625 42.374-17.625 24.749 0 42.374 17.625 17.624 17.625 17.624 42.374 0 24.749-17.624 42.374-17.625 17.625-42.374 17.625Z" />
            </svg>
          </button>
        </div>
      </div>

      <BottomSheet visible={isSheetVisible} toggleVisible={toggleSheet} label={currFolder.name}>
        <ActionList
          data={menuOptions}
          keyExtractor={(item) => item.title}
          renderItem={(item, index) => (
            <ActionList.Button onClick={item.action} isFirst={index === 0}>
              {item.title}
            </ActionList.Button>
          )}
        />
      </BottomSheet>

      <div className="p-4 max-w-3xl mx-auto">
        <ActionList
          data={currFolder.sets}
          keyExtractor={(item) => item.id}
          renderItem={(item, index) => (
            <ActionList.Link href={`/sets/${item.id}`} isFirst={index === 0}>
              {item.title}
            </ActionList.Link>
          )}
        />
      </div>

      <FolderForm folderFigure={currFolder} isOpen={shownModal === 'edit'} onClose={closeModal} />
      <Modal isOpen={shownModal === 'del'} onClose={closeModal}>
        <ModalBody>
          <h3>{`Remove "${currFolder.name}"?`}</h3>
          <p>Deleting a folder is a permanent action.</p>
          <p>Sets in this folder will not be deleted.</p>
        </ModalBody>
        <ModalActions>
          <button onClick={closeModal}>Cancel</button>
          <button onClick={onDelete} style={{ color: 'var(--color-error)' }}>
            Delete
          </button>
        </ModalActions>
      </Modal>
      <Modal isOpen={shownModal === 'sets'} onClose={closeModal}>
        <ModalBody>
          {sets?.length ? (
            <>
              <h3>Sets Management</h3>
              <p>Organise sets you&#39;re studying for a particular subject</p>
            </>
          ) : (
            <h3>You don&#39;t have sets</h3>
          )}
        </ModalBody>
        {sets?.length ? (
          <ModalList>
            {sets.map((content) => (
              <li key={content.id}>
                <Toggle
                  label={content.title}
                  onClick={() => toggleIncludeFolder(content)}
                  defaultChecked={!!includedSets.find((el) => el.id === content.id)}
                />
              </li>
            ))}
          </ModalList>
        ) : undefined}
        <ModalActions>
          {sets?.length ? (
            <>
              <button onClick={closeModal}>Cancel</button>
              <button onClick={updateFolderSets}>Apply</button>
            </>
          ) : (
            <button onClick={closeModal}>OK</button>
          )}
        </ModalActions>
      </Modal>
    </>
  );
};

SetList.getInitialProps = async ({ query }) => {
  const pagekey = typeof query.folder === 'string' ? query.folder : '';
  const queryClient = new QueryClient();
  if (pagekey) await queryClient.prefetchQuery(['folder', pagekey], () => folderApi.getById(pagekey));
  return { pagekey, dehydratedState: dehydrate(queryClient) };
};

export default SetList;
