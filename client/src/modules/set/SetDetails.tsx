import React from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { QueryClient, useQuery, dehydrate, useMutation, useQueryClient } from 'react-query';
import { setApi } from 'apis/setApi';
import { useRouter } from 'next/dist/client/router';
import { notify } from 'lib/notify';
import { Modal, ModalBody, ModalActions, ModalList } from 'ui/Modal';
import Custom404 from 'pages/404';
import { useSetStore } from 'storage/useSetStore';
import { folderApi } from 'apis/folderApi';
import { FolderInterface, SetInterface, UserInterface } from 'interfaces';
import { useUserStore } from 'storage/useUserStore';
import { formatDate, shareValue } from 'lib/utils';
import { Toggle } from 'ui/Toggle';
import { BottomSheet, useBottomSheet } from 'ui/BottomSheet';
import { ActionList } from '@src/ui/ActionList';

type ModalVariants = 'del' | 'info' | 'folder';
type ManageSetProps = {
  isSheetVisible: boolean;
  toggleSheet: () => void;
  openModal: (payload: ModalVariants) => void;
  shownModal: string | undefined;
  closeModal: () => void;
  set: SetInterface;
  signAccess: string | undefined;
  pagekey: string;
};
type ManageFoldersProps = {
  set: SetInterface;
  user: UserInterface | undefined;
  isModalOpened: boolean;
  onCloseModal: () => void;
  signAccess: string | undefined;
  pagekey: string;
};

const SetDetails: NextPage<{ pagekey: string }> = ({ pagekey }) => {
  const { user, signAccess } = useUserStore();
  const { toggleSheet, isSheetVisible } = useBottomSheet();

  const set = useQuery(['set', pagekey], () => setApi.getById(pagekey), { enabled: !!pagekey });
  const [currSet, setCurrSet] = React.useState<SetInterface>();
  React.useEffect(() => {
    setCurrSet(set.data);
  }, [set.data]);

  const [shownModal, setShownModal] = React.useState<ModalVariants>();
  const openModal = (payload: ModalVariants) => {
    toggleSheet(false);
    setShownModal(payload);
  };
  const closeModal = () => setShownModal(undefined);

  const studyMethods = [
    { title: 'Learn', href: `${pagekey}/learn` },
    { title: 'Flashcards', href: `${pagekey}/flashcards` },
    { title: 'Write', href: `${pagekey}/write` },
    { title: 'Exam', href: `${pagekey}/exam` },
  ];

  if (!currSet) return <Custom404 />;
  return (
    <>
      <div className="bg-white py-8 border-b border-b-gray-200">
        <div className="max-w-4xl mx-auto flex flex-col gap-4 px-4">
          <div>
            <h1 className="text-3xl">{currSet.title}</h1>
            {currSet.description ? <p className="leading-relaxed text-gray-600">{currSet.description}</p> : null}
          </div>
          {studyMethods.map((item) => (
            <Link key={item.title} href={item.href}>
              <a className="border border-gray-200 border-solid w-full p-2 rounded-lg flex items-center justify-center">
                {item.title}
              </a>
            </Link>
          ))}
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

      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl mb-4">Overview</h2>
        <ul className="flex flex-col gap-2">
          {currSet.cards.map((content, i) => (
            <li key={i} className="flex border-b border-b-gray-200 p-2">
              <p className="basis-full">{content.term}</p>
              <p className="basis-full">{content.definition}</p>
            </li>
          ))}
        </ul>
      </div>

      <ManageSet
        isSheetVisible={isSheetVisible}
        toggleSheet={toggleSheet}
        openModal={openModal}
        shownModal={shownModal}
        closeModal={closeModal}
        set={currSet}
        signAccess={signAccess}
        pagekey={pagekey}
      />
      <ManageFolders
        set={currSet}
        user={user}
        isModalOpened={shownModal === 'folder'}
        onCloseModal={closeModal}
        signAccess={signAccess}
        pagekey={pagekey}
      />
    </>
  );
};

const ManageSet: React.FC<ManageSetProps> = ({
  isSheetVisible,
  toggleSheet,
  openModal,
  shownModal,
  closeModal,
  set,
  signAccess,
  pagekey,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { setSetFigure } = useSetStore();
  const onEdit = () => {
    setSetFigure(set);
    router.push(`${pagekey}/update`);
  };

  const fetchDelete = useMutation(setApi.delete, {
    onSuccess: () => {
      notify('Successfully deleted study set');
      queryClient.invalidateQueries('sets');
      return router.push('/');
    },
  });
  const onDeleteSet = async () => {
    if (!set) return;
    await fetchDelete.mutateAsync({ id: set.id, token: signAccess }).catch(() => null);
  };

  const menuOptions = [
    { title: 'Information', action: () => openModal('info') },
    { title: 'Share', action: () => shareValue(window.location.href) },
    { title: 'Author', action: () => true },
    { title: 'Edit', action: onEdit },
    { title: 'Add to Folder', action: () => openModal('folder') },
    { title: 'Delete', action: () => openModal('del') },
  ];

  return (
    <>
      <BottomSheet visible={isSheetVisible} toggleVisible={toggleSheet} label={set.title}>
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
      <Modal isOpen={!!shownModal} onClose={closeModal}>
        <ModalBody>
          {shownModal
            ? {
                del: (
                  <>
                    <h3>{`Remove "${set.title}"?`}</h3>
                    <p>Deleting a set is a permanent action.</p>
                  </>
                ),
                info: (
                  <>
                    <h3>Information</h3>
                    <p>{`This set was created ${formatDate({ createdAt: set.createdAt, pattern: 'dd MMM yyyy' })}`}</p>
                  </>
                ),
                folder: null,
              }[shownModal]
            : undefined}
        </ModalBody>
        <ModalActions>
          {shownModal
            ? {
                del: (
                  <>
                    <button onClick={closeModal}>Cancel</button>
                    <button onClick={onDeleteSet} style={{ color: 'var(--color-error)' }}>
                      Delete
                    </button>
                  </>
                ),
                info: <button onClick={closeModal}>OK</button>,
                folder: null,
              }[shownModal]
            : undefined}
        </ModalActions>
      </Modal>
    </>
  );
};

const ManageFolders: React.FC<ManageFoldersProps> = ({ set, user, isModalOpened, onCloseModal, signAccess, pagekey }) => {
  const userFolders = useQuery('userFolders', () => folderApi.getByUser(user!.id), { enabled: isModalOpened && !!user });
  const folders = userFolders.data;
  const [includedFolders, setIncludedFolders] = React.useState<FolderInterface[]>([]);
  React.useEffect(() => {
    if (set && set.folders?.length) setIncludedFolders(set.folders);
  }, [set]);
  const toggleIncludeFolder = (payload: FolderInterface) => {
    if (includedFolders.find((el) => el.id === payload.id)) setIncludedFolders(includedFolders.filter((el) => el.id !== payload.id));
    else setIncludedFolders([...includedFolders, payload]);
  };
  const queryClient = useQueryClient();
  const fetchUpdate = useMutation(setApi.save, { onSuccess: () => queryClient.invalidateQueries(['set', pagekey]) });
  const updateSetFolders = async () => {
    if (!set) return;
    try {
      await fetchUpdate.mutateAsync({ data: { ...set, folders: includedFolders }, token: signAccess });
      onCloseModal();
    } catch (error) {}
  };

  return (
    <Modal isOpen={isModalOpened} onClose={onCloseModal}>
      <ModalBody>
        {folders?.length ? (
          <>
            <h3>Folder Management</h3>
            <p>Organise set for a particular subject</p>
          </>
        ) : (
          <>
            <h3>You don&#39;t have folders</h3>
            <p>Create folders to organise sets for a particular subject</p>
          </>
        )}
      </ModalBody>
      {folders?.length ? (
        <ModalList>
          {folders.map((content) => (
            <li key={content.id}>
              <Toggle
                label={content.name}
                onClick={() => toggleIncludeFolder(content)}
                defaultChecked={!!set.folders?.find(({ id }) => id === content.id)}
              />
            </li>
          ))}
        </ModalList>
      ) : (
        <div style={{ textAlign: 'center', paddingBottom: '2rem', fontSize: '4rem' }}>📁</div>
      )}
      <ModalActions>
        {folders?.length ? (
          <>
            <button onClick={onCloseModal}>Cancel</button>
            <button onClick={updateSetFolders}>Apply</button>
          </>
        ) : (
          <button onClick={onCloseModal}>OK</button>
        )}
      </ModalActions>
    </Modal>
  );
};

SetDetails.getInitialProps = async ({ query }) => {
  const pagekey = typeof query.id === 'string' ? query.id : '';
  const queryClient = new QueryClient();
  if (pagekey) await queryClient.prefetchQuery(['set', pagekey], () => setApi.getById(pagekey));
  return { pagekey, dehydratedState: dehydrate(queryClient) };
};

export default SetDetails;
